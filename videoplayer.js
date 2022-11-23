var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var webglvideo;
(function (webglvideo) {
    webglvideo.ENABLE_DEBUG_LOGGING = false;
    function debugLog(msg) {
        if (!webglvideo.ENABLE_DEBUG_LOGGING) {
            return;
        }
        console.log(msg);
    }
    webglvideo.debugLog = debugLog;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    webglvideo.AUDIO_STREAM_TYPE = 0;
    webglvideo.VIDEO_STREAM_TYPE = 1;
    // Interface to be extended by concrete demuxer implementations.
    class PullDemuxerBase {
        // Starts fetching file. Resolves when enough of the file is fetched/parsed to
        // populate getDecoderConfig().
        initialize(streamType) {
            return __awaiter(this, void 0, void 0, function* () { });
        }
        // Returns either an AudioDecoderConfig or VideoDecoderConfig based on the
        // streamType passed to initialize().
        getDecoderConfig() { }
        // Returns either EncodedAudioChunks or EncodedVideoChunks based on the
        // streamType passed to initialize(). Returns null after EOF.
        getNextChunk() {
            return __awaiter(this, void 0, void 0, function* () { });
        }
    }
    webglvideo.PullDemuxerBase = PullDemuxerBase;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    class RingBuffer {
        // `sab` is a SharedArrayBuffer with a capacity calculated by calling
        // `getStorageForCapacity` with the desired capacity.
        constructor(sab, type) {
            //!ArrayBuffer.__proto__.isPrototypeOf(type) &&
            // if (type.BYTES_PER_ELEMENT !== undefined) {
            //   throw "Pass a concrete typed array class as second argument";
            // }
            // Maximum usable size is 1<<32 - type.BYTES_PER_ELEMENT bytes in the ring
            // buffer for this version, easily changeable.
            // -4 for the write ptr (uint32_t offsets)
            // -4 for the read ptr (uint32_t offsets)
            // capacity counts the empty slot to distinguish between full and empty.
            this._type = type;
            this._capacity = (sab.byteLength - 8) / type.BYTES_PER_ELEMENT;
            this.buf = sab;
            this.write_ptr = new Uint32Array(this.buf, 0, 1);
            this.read_ptr = new Uint32Array(this.buf, 4, 1);
            this.storage = new type(this.buf, 8, this._capacity);
        }
        static getStorageForCapacity(capacity, type) {
            if (!type.BYTES_PER_ELEMENT) {
                throw "Pass in a ArrayBuffer subclass";
            }
            var bytes = 8 + (capacity + 1) * type.BYTES_PER_ELEMENT;
            return new SharedArrayBuffer(bytes);
        }
        // Returns the type of the underlying ArrayBuffer for this RingBuffer. This
        // allows implementing crude type checking.
        type() {
            return this._type.name;
        }
        // Push bytes to the ring buffer. `elements` is a typed array of the same type
        // as passed in the ctor, to be written to the queue.
        // Returns the number of elements written to the queue.
        push(elements) {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            if ((wr + 1) % this._storage_capacity() == rd) {
                // full
                return 0;
            }
            let to_write = Math.min(this._available_write(rd, wr), elements.length);
            let first_part = Math.min(this._storage_capacity() - wr, to_write);
            let second_part = to_write - first_part;
            this._copy(elements, 0, this.storage, wr, first_part);
            this._copy(elements, first_part, this.storage, 0, second_part);
            // publish the enqueued data to the other side
            Atomics.store(this.write_ptr, 0, (wr + to_write) % this._storage_capacity());
            return to_write;
        }
        // Write bytes to the ring buffer using callbacks. This create wrapper
        // objects and can GC, so it's best to no use this variant from a real-time
        // thread such as an AudioWorklerProcessor `process` method.
        // The callback is passed two typed arrays of the same type, to be filled.
        // This allows skipping copies if the API that produces the data writes is
        // passed arrays to write to, such as `AudioData.copyTo`.
        writeCallback(amount, cb) {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            if ((wr + 1) % this._storage_capacity() == rd) {
                // full
                return 0;
            }
            let to_write = Math.min(this._available_write(rd, wr), amount);
            let first_part = Math.min(this._storage_capacity() - wr, to_write);
            let second_part = to_write - first_part;
            // This part will cause GC: don't use in the real time thread.
            var first_part_buf = new this._type(this.storage.buffer, 8 + wr * 4, first_part);
            var second_part_buf = new this._type(this.storage.buffer, 8 + 0, second_part);
            cb(first_part_buf, second_part_buf);
            // publish the enqueued data to the other side
            Atomics.store(this.write_ptr, 0, (wr + to_write) % this._storage_capacity());
            return to_write;
        }
        // Read `elements.length` elements from the ring buffer. `elements` is a typed
        // array of the same type as passed in the ctor.
        // Returns the number of elements read from the queue, they are placed at the
        // beginning of the array passed as parameter.
        pop(elements) {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            if (wr == rd) {
                return 0;
            }
            let to_read = Math.min(this._available_read(rd, wr), elements.length);
            let first_part = Math.min(this._storage_capacity() - rd, to_read);
            let second_part = to_read - first_part;
            this._copy(this.storage, rd, elements, 0, first_part);
            this._copy(this.storage, 0, elements, first_part, second_part);
            Atomics.store(this.read_ptr, 0, (rd + to_read) % this._storage_capacity());
            return to_read;
        }
        // True if the ring buffer is empty false otherwise. This can be late on the
        // reader side: it can return true even if something has just been pushed.
        empty() {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            return wr == rd;
        }
        // True if the ring buffer is full, false otherwise. This can be late on the
        // write side: it can return true when something has just been popped.
        full() {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            return (wr + 1) % this._storage_capacity() == rd;
        }
        // The usable capacity for the ring buffer: the number of elements that can be
        // stored.
        capacity() {
            return this._capacity - 1;
        }
        // Number of elements available for reading. This can be late, and report less
        // elements that is actually in the queue, when something has just been
        // enqueued.
        available_read() {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            return this._available_read(rd, wr);
        }
        // Number of elements available for writing. This can be late, and report less
        // elements that is actually available for writing, when something has just
        // been dequeued.
        available_write() {
            var rd = Atomics.load(this.read_ptr, 0);
            var wr = Atomics.load(this.write_ptr, 0);
            return this._available_write(rd, wr);
        }
        // private methods //
        // Number of elements available for reading, given a read and write pointer..
        _available_read(rd, wr) {
            return (wr + this._storage_capacity() - rd) % this._storage_capacity();
        }
        // Number of elements available from writing, given a read and write pointer.
        _available_write(rd, wr) {
            return this.capacity() - this._available_read(rd, wr);
        }
        // The size of the storage for elements not accounting the space for the
        // index, counting the empty slot.
        _storage_capacity() {
            return this._capacity;
        }
        // Copy `size` elements from `input`, starting at offset `offset_input`, to
        // `output`, starting at offset `offset_output`.
        _copy(input, offset_input, output, offset_output, size) {
            for (var i = 0; i < size; i++) {
                output[offset_output + i] = input[offset_input + i];
            }
        }
    }
    webglvideo.RingBuffer = RingBuffer;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    class MP4FileSink {
        constructor(file, setStatus) {
            this.file = file;
            this.setStatus = setStatus;
            this.offset = 0;
        }
        write(chunk) {
            // MP4Box.js requires buffers to be ArrayBuffers, but we have a Uint8Array.
            var buffer;
            buffer = new ArrayBuffer(chunk.byteLength);
            new Uint8Array(buffer).set(chunk);
            // Inform MP4Box where in the file this chunk is from.
            buffer.fileStart = this.offset;
            this.offset += buffer.byteLength;
            // Append chunk.
            this.setStatus("fetch", (this.offset / (Math.pow(1024, 2))).toFixed(1) + " MiB");
            this.file.appendBuffer(buffer);
        }
        close() {
            this.setStatus("fetch", "Done");
            this.file.flush();
        }
    }
    webglvideo.MP4FileSink = MP4FileSink;
    // Demuxes the first video track of an MP4 file using MP4Box, calling
    // `onConfig()` and `onChunk()` with appropriate WebCodecs objects.
    class MP4Demuxer {
        constructor(uri, { onConfig, onChunk, setStatus }) {
            this.onConfig = onConfig;
            this.onChunk = onChunk;
            this.setStatus = setStatus;
            // Configure an MP4Box File for demuxing.
            this.file = MP4Box.createFile();
            this.file.onError = error => setStatus("demux", error);
            this.file.onReady = this.onReady.bind(this);
            this.file.onSamples = this.onSamples.bind(this);
            // Fetch the file and pipe the data through.
            const fileSink = new MP4FileSink(this.file, setStatus);
            fetch(uri).then(response => {
                // highWaterMark should be large enough for smooth streaming, but lower is
                let var_response;
                var_response = response;
                // better for memory usage.
                var_response.body.pipeTo(new WritableStream(fileSink, { highWaterMark: 2 }));
            });
        }
        // Get the appropriate `description` for a specific track. Assumes that the
        // track is H.264 or H.265.
        description(track) {
            const trak = this.file.getTrackById(track.id);
            for (const entry of trak.mdia.minf.stbl.stsd.entries) {
                if (entry.avcC || entry.hvcC) {
                    const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
                    if (entry.avcC) {
                        entry.avcC.write(stream);
                    }
                    else {
                        entry.hvcC.write(stream);
                    }
                    return new Uint8Array(stream.buffer, 8); // Remove the box header.
                }
            }
            throw "avcC or hvcC not found";
        }
        onReady(info) {
            this.setStatus("demux", "Ready");
            const track = info.videoTracks[0];
            // Generate and emit an appropriate VideoDecoderConfig.
            this.onConfig({
                codec: track.codec,
                codedHeight: track.video.height,
                codedWidth: track.video.width,
                description: this.description(track),
            });
            // Start demuxing.
            this.file.setExtractionOptions(track.id);
            this.file.start();
        }
        onSamples(track_id, ref, samples) {
            // Generate and emit an EncodedVideoChunk for each demuxed sample.
            for (const sample of samples) {
                this.onChunk(new EncodedVideoChunk({
                    type: sample.is_sync ? "key" : "delta",
                    timestamp: 1e6 * sample.cts / sample.timescale,
                    duration: 1e6 * sample.duration / sample.timescale,
                    data: sample.data
                }));
            }
        }
    }
    webglvideo.MP4Demuxer = MP4Demuxer;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    class WebGLRenderer {
        constructor(type, canvas) {
            this.canvas = canvas;
            const gl = this.ctx = canvas.getContext(type);
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, WebGLRenderer.vertexShaderSource);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                throw gl.getShaderInfoLog(vertexShader);
            }
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, WebGLRenderer.fragmentShaderSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                throw gl.getShaderInfoLog(fragmentShader);
            }
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw gl.getProgramInfoLog(shaderProgram);
            }
            gl.useProgram(shaderProgram);
            // Vertex coordinates, clockwise from bottom-left.
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1.0, -1.0,
                -1.0, +1.0,
                +1.0, +1.0,
                +1.0, -1.0
            ]), gl.STATIC_DRAW);
            const xyLocation = gl.getAttribLocation(shaderProgram, "xy");
            gl.vertexAttribPointer(xyLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(xyLocation);
            // Create one texture to upload frames to.
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        draw(frame) {
            this.canvas.width = frame.displayWidth;
            this.canvas.height = frame.displayHeight;
            const gl = this.ctx;
            // Upload the frame.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, frame);
            frame.close();
            // Configure and clear the drawing area.
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(1.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Draw the frame.
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
    }
    WebGLRenderer.vertexShaderSource = `
      attribute vec2 xy;

      varying highp vec2 uv;

      void main(void) {
        gl_Position = vec4(xy, 0.0, 1.0);
        // Map vertex coordinates (-1 to +1) to UV coordinates (0 to 1).
        // UV coordinates are Y-flipped relative to vertex coordinates.
        uv = vec2((1.0 + xy.x) / 2.0, (1.0 - xy.y) / 2.0);
      }
    `;
    WebGLRenderer.fragmentShaderSource = `
      varying highp vec2 uv;

      uniform sampler2D texture;

      void main(void) {
        gl_FragColor = texture2D(texture, uv);
      }
    `;
    webglvideo.WebGLRenderer = WebGLRenderer;
    ;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    const DATA_BUFFER_DECODE_TARGET_DURATION = 0.3;
    const DATA_BUFFER_DURATION = 0.6;
    const DECODER_QUEUE_SIZE_MAX = 5;
    class AudioRenderer {
        constructor() {
        }
        initialize(demuxer) {
            return __awaiter(this, void 0, void 0, function* () {
                this.fillInProgress = false;
                this.playing = false;
                this.demuxer = demuxer;
                yield this.demuxer.initialize(webglvideo.AUDIO_STREAM_TYPE);
                this.decoder = new AudioDecoder({
                    output: this.bufferAudioData.bind(this),
                    error: e => console.error(e)
                });
                const config = this.demuxer.getDecoderConfig();
                this.sampleRate = config.sampleRate;
                this.channelCount = config.numberOfChannels;
                webglvideo.debugLog(config);
                console.assert(AudioDecoder.isConfigSupported(config));
                this.decoder.configure(config);
                // Initialize the ring buffer between the decoder and the real-time audio
                // rendering thread. The AudioRenderer has buffer space for approximately
                // 500ms of decoded audio ahead.
                let sampleCountIn500ms = DATA_BUFFER_DURATION * this.sampleRate * this.channelCount;
                let sab = webglvideo.RingBuffer.getStorageForCapacity(sampleCountIn500ms, Float32Array);
                this.ringbuffer = new webglvideo.RingBuffer(sab, Float32Array);
                this.interleavingBuffers = [];
                this.init_resolver = null;
                let promise = new Promise(resolver => (this.init_resolver = resolver));
                this.fillDataBuffer();
                return promise;
            });
        }
        play() {
            // resolves when audio has effectively started: this can take some time if using
            // bluetooth, for example.
            webglvideo.debugLog("playback start");
            this.playing = true;
            this.fillDataBuffer();
        }
        pause() {
            webglvideo.debugLog("playback stop");
            this.playing = false;
        }
        fillDataBuffer() {
            return __awaiter(this, void 0, void 0, function* () {
                // This method is called from multiple places to ensure the buffer stays
                // healthy. Sometimes these calls may overlap, but at any given point only
                // one call is desired.
                if (this.fillInProgress)
                    return;
                this.fillInProgress = true;
                // This should be this file's ONLY call to the *Internal() variant of this method.
                yield this.fillDataBufferInternal();
                this.fillInProgress = false;
            });
        }
        fillDataBufferInternal() {
            return __awaiter(this, void 0, void 0, function* () {
                webglvideo.debugLog(`fillDataBufferInternal()`);
                if (this.decoder.decodeQueueSize >= DECODER_QUEUE_SIZE_MAX) {
                    webglvideo.debugLog('\tdecoder saturated');
                    // Some audio decoders are known to delay output until the next input.
                    // Make sure the DECODER_QUEUE_SIZE is big enough to avoid stalling on the
                    // return below. We're relying on decoder output callback to trigger
                    // another call to fillDataBuffer().
                    console.assert(DECODER_QUEUE_SIZE_MAX >= 2);
                    return;
                }
                let usedBufferElements = this.ringbuffer.capacity() - this.ringbuffer.available_write();
                let usedBufferSecs = usedBufferElements / (this.channelCount * this.sampleRate);
                let pcntOfTarget = 100 * usedBufferSecs / DATA_BUFFER_DECODE_TARGET_DURATION;
                if (usedBufferSecs >= DATA_BUFFER_DECODE_TARGET_DURATION) {
                    webglvideo.debugLog(`\taudio buffer full usedBufferSecs: ${usedBufferSecs} pcntOfTarget: ${pcntOfTarget}`);
                    // When playing, schedule timeout to periodically refill buffer. Don't
                    // bother scheduling timeout if decoder already saturated. The output
                    // callback will call us back to keep filling.
                    if (this.playing)
                        // Timeout to arrive when buffer is half empty.
                        setTimeout(this.fillDataBuffer.bind(this), 1000 * usedBufferSecs / 2);
                    // Initialize() is done when the buffer fills for the first time.
                    if (this.init_resolver) {
                        this.init_resolver();
                        this.init_resolver = null;
                    }
                    // Buffer full, so no further work to do now.
                    return;
                }
                // Decode up to the buffering target or until decoder is saturated.
                while (usedBufferSecs < DATA_BUFFER_DECODE_TARGET_DURATION &&
                    this.decoder.decodeQueueSize < DECODER_QUEUE_SIZE_MAX) {
                    webglvideo.debugLog(`\tMore samples. usedBufferSecs:${usedBufferSecs} < target:${DATA_BUFFER_DECODE_TARGET_DURATION}.`);
                    let chunk = yield this.demuxer.getNextChunk();
                    this.decoder.decode(chunk);
                    // NOTE: awaiting the demuxer.readSample() above will also give the
                    // decoder output callbacks a chance to run, so we may see usedBufferSecs
                    // increase.
                    usedBufferElements = this.ringbuffer.capacity() - this.ringbuffer.available_write();
                    usedBufferSecs = usedBufferElements / (this.channelCount * this.sampleRate);
                }
                if (webglvideo.ENABLE_DEBUG_LOGGING) {
                    let logPrefix = usedBufferSecs >= DATA_BUFFER_DECODE_TARGET_DURATION ?
                        '\tbuffered enough' : '\tdecoder saturated';
                    pcntOfTarget = 100 * usedBufferSecs / DATA_BUFFER_DECODE_TARGET_DURATION;
                    webglvideo.debugLog(logPrefix + `; bufferedSecs:${usedBufferSecs} pcntOfTarget: ${pcntOfTarget}`);
                }
            });
        }
        bufferHealth() {
            return (1 - this.ringbuffer.available_write() / this.ringbuffer.capacity()) * 100;
        }
        // From a array of Float32Array containing planar audio data `input`, writes
        // interleaved audio data to `output`. Start the copy at sample
        // `inputOffset`: index of the sample to start the copy from
        // `inputSamplesToCopy`: number of input samples to copy
        // `output`: a Float32Array to write the samples to
        // `outputSampleOffset`: an offset in `output` to start writing
        interleave(inputs, inputOffset, inputSamplesToCopy, output, outputSampleOffset) {
            if (inputs.length * inputs[0].length < output.length) {
                throw `not enough space in destination (${inputs.length * inputs[0].length} < ${output.length}})`;
            }
            let channelCount = inputs.length;
            let outIdx = outputSampleOffset;
            let inputIdx = Math.floor(inputOffset / channelCount);
            var channel = inputOffset % channelCount;
            for (var i = 0; i < inputSamplesToCopy; i++) {
                output[outIdx++] = inputs[channel][inputIdx];
                if (++channel == inputs.length) {
                    channel = 0;
                    inputIdx++;
                }
            }
        }
        bufferAudioData(data) {
            if (this.interleavingBuffers.length != data.numberOfChannels) {
                this.interleavingBuffers = new Array(this.channelCount);
                for (var i = 0; i < this.interleavingBuffers.length; i++) {
                    this.interleavingBuffers[i] = new Float32Array(data.numberOfFrames);
                }
            }
            webglvideo.debugLog(`bufferAudioData() ts:${data.timestamp} durationSec:${data.duration / 1000000}`);
            // Write to temporary planar arrays, and interleave into the ring buffer.
            for (var i = 0; i < this.channelCount; i++) {
                data.copyTo(this.interleavingBuffers[i], { planeIndex: i });
            }
            // Write the data to the ring buffer. Because it wraps around, there is
            // potentially two copyTo to do.
            let wrote = this.ringbuffer.writeCallback(data.numberOfFrames * data.numberOfChannels, (first_part, second_part) => {
                this.interleave(this.interleavingBuffers, 0, first_part.length, first_part, 0);
                this.interleave(this.interleavingBuffers, first_part.length, second_part.length, second_part, 0);
            });
            // FIXME - this could theoretically happen since we're pretty agressive
            // about saturating the decoder without knowing the size of the
            // AudioData.duration vs ring buffer capacity.
            console.assert(wrote == data.numberOfChannels * data.numberOfFrames, 'Buffer full, dropping data!');
            // Logging maxBufferHealth below shows we currently max around 73%, so we're
            // safe from the assert above *for now*. We should add an overflow buffer
            // just to be safe.
            // let bufferHealth = this.bufferHealth();
            // if (!('maxBufferHealth' in this))
            //   this.maxBufferHealth = 0;
            // if (bufferHealth > this.maxBufferHealth) {
            //   this.maxBufferHealth = bufferHealth;
            //   console.log(`new maxBufferHealth:${this.maxBufferHealth}`);
            // }
            // fillDataBuffer() gives up if too much decode work is queued. Keep trying
            // now that we've finished some.
            this.fillDataBuffer();
        }
    }
    webglvideo.AudioRenderer = AudioRenderer;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    const FRAME_BUFFER_TARGET_SIZE = 3;
    // Controls demuxing and decoding of the video track, as well as rendering
    // VideoFrames to canvas. Maintains a buffer of FRAME_BUFFER_TARGET_SIZE
    // decoded frames for future rendering.
    class VideoRenderer {
        constructor() {
        }
        initialize(demuxer, canvas) {
            return __awaiter(this, void 0, void 0, function* () {
                this.frameBuffer = [];
                this.fillInProgress = false;
                this.demuxer = demuxer;
                yield this.demuxer.initialize(webglvideo.VIDEO_STREAM_TYPE);
                const config = this.demuxer.getDecoderConfig();
                this.createGlContext("webgl", canvas);
                this.decoder = new VideoDecoder({
                    output: this.bufferFrame.bind(this),
                    error: e => console.error(e),
                });
                console.assert(VideoDecoder.isConfigSupported(config));
                this.decoder.configure(config);
                this.init_resolver = null;
                let promise = new Promise((resolver) => this.init_resolver = resolver);
                this.fillFrameBuffer();
                return promise;
            });
        }
        render(timestamp) {
            webglvideo.debugLog('render(%d)' + timestamp);
            let frame = this.chooseFrame(timestamp);
            this.fillFrameBuffer();
            if (frame == null) {
                console.warn('VideoRenderer.render(): no frame ');
                return;
            }
            this.draw(frame);
        }
        chooseFrame(timestamp) {
            if (this.frameBuffer.length == 0)
                return null;
            let minTimeDelta = Number.MAX_VALUE;
            let frameIndex = -1;
            for (let i = 0; i < this.frameBuffer.length; i++) {
                let time_delta = Math.abs(timestamp - this.frameBuffer[i].timestamp);
                if (time_delta < minTimeDelta) {
                    minTimeDelta = time_delta;
                    frameIndex = i;
                }
                else {
                    break;
                }
            }
            console.assert(frameIndex != -1);
            if (frameIndex > 0)
                webglvideo.debugLog('dropping %d stale frames' + frameIndex);
            for (let i = 0; i < frameIndex; i++) {
                let staleFrame = this.frameBuffer.shift();
                staleFrame.close();
            }
            let chosenFrame = this.frameBuffer[0];
            webglvideo.debugLog('frame time delta = %dms (%d vs %d)' + minTimeDelta / 1000 + timestamp + chosenFrame.timestamp);
            return chosenFrame;
        }
        fillFrameBuffer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.frameBufferFull()) {
                    webglvideo.debugLog('frame buffer full');
                    if (this.init_resolver) {
                        this.init_resolver();
                        this.init_resolver = null;
                    }
                    return;
                }
                // This method can be called from multiple places and we some may already
                // be awaiting a demuxer read (only one read allowed at a time).
                if (this.fillInProgress) {
                    return false;
                }
                this.fillInProgress = true;
                while (this.frameBuffer.length < FRAME_BUFFER_TARGET_SIZE &&
                    this.decoder.decodeQueueSize < FRAME_BUFFER_TARGET_SIZE) {
                    let chunk = yield this.demuxer.getNextChunk();
                    this.decoder.decode(chunk);
                }
                this.fillInProgress = false;
                // Give decoder a chance to work, see if we saturated the pipeline.
                setTimeout(this.fillFrameBuffer.bind(this), 0);
            });
        }
        frameBufferFull() {
            return this.frameBuffer.length >= FRAME_BUFFER_TARGET_SIZE;
        }
        bufferFrame(frame) {
            webglvideo.debugLog(`bufferFrame(${frame.timestamp})`);
            this.frameBuffer.push(frame);
        }
        createGlContext(type, canvas) {
            this.canvas = canvas;
            const gl = this.canvasCtx = canvas.getContext(type);
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, VideoRenderer.vertexShaderSource);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                throw gl.getShaderInfoLog(vertexShader);
            }
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, VideoRenderer.fragmentShaderSource);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                throw gl.getShaderInfoLog(fragmentShader);
            }
            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw gl.getProgramInfoLog(shaderProgram);
            }
            gl.useProgram(shaderProgram);
            // Vertex coordinates, clockwise from bottom-left.
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1.0, -1.0,
                -1.0, +1.0,
                +1.0, +1.0,
                +1.0, -1.0
            ]), gl.STATIC_DRAW);
            const xyLocation = gl.getAttribLocation(shaderProgram, "xy");
            gl.vertexAttribPointer(xyLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(xyLocation);
            // Create one texture to upload frames to.
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        draw(frame) {
            this.canvas.width = frame.displayWidth;
            this.canvas.height = frame.displayHeight;
            const gl = this.canvasCtx;
            // Upload the frame.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, frame);
            frame.close();
            // Configure and clear the drawing area.
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(1.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Draw the frame.
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        }
    }
    // paint(frame) {
    //   this.canvasCtx.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height);
    // }
    //////////////////////////////////////////
    VideoRenderer.vertexShaderSource = `
      attribute vec2 xy;

      varying highp vec2 uv;

      void main(void) {
        gl_Position = vec4(xy, 0.0, 1.0);
        // Map vertex coordinates (-1 to +1) to UV coordinates (0 to 1).
        // UV coordinates are Y-flipped relative to vertex coordinates.
        uv = vec2((1.0 + xy.x) / 2.0, (1.0 - xy.y) / 2.0);
      }
    `;
    VideoRenderer.fragmentShaderSource = `
      varying highp vec2 uv;

      uniform sampler2D texture;

      void main(void) {
        gl_FragColor = texture2D(texture, uv);
      }
    `;
    webglvideo.VideoRenderer = VideoRenderer;
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    class MP4PullDemuxer extends webglvideo.PullDemuxerBase {
        constructor(fileUri) {
            super();
            this.fileUri = fileUri;
        }
        initialize(streamType) {
            return __awaiter(this, void 0, void 0, function* () {
                this.source = new MP4Source(this.fileUri);
                this.readySamples = [];
                this._pending_read_resolver = null;
                this.streamType = streamType;
                yield this._tracksReady();
                if (this.streamType == webglvideo.AUDIO_STREAM_TYPE) {
                    this._selectTrack(this.audioTrack);
                }
                else {
                    this._selectTrack(this.videoTrack);
                }
            });
        }
        getDecoderConfig() {
            if (this.streamType == webglvideo.AUDIO_STREAM_TYPE) {
                return {
                    codec: this.audioTrack.codec,
                    sampleRate: this.audioTrack.audio.sample_rate,
                    numberOfChannels: this.audioTrack.audio.channel_count,
                    description: this.source.getAudioSpecificConfig()
                };
            }
            else {
                return {
                    codec: this.videoTrack.codec,
                    displayWidth: this.videoTrack.track_width,
                    displayHeight: this.videoTrack.track_height,
                    description: this._getAvcDescription(this.source.getAvccBox())
                };
            }
        }
        getNextChunk() {
            return __awaiter(this, void 0, void 0, function* () {
                let sample = yield this._readSample();
                const type = sample.is_sync ? "key" : "delta";
                const pts_us = (sample.cts * 1000000) / sample.timescale;
                const duration_us = (sample.duration * 1000000) / sample.timescale;
                const ChunkType = this.streamType == webglvideo.AUDIO_STREAM_TYPE ? EncodedAudioChunk : EncodedVideoChunk;
                return new ChunkType({
                    type: type,
                    timestamp: pts_us,
                    duration: duration_us,
                    data: sample.data
                });
            });
        }
        _getAvcDescription(avccBox) {
            const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
            avccBox.write(stream);
            return new Uint8Array(stream.buffer, 8); // Remove the box header.
        }
        _tracksReady() {
            return __awaiter(this, void 0, void 0, function* () {
                let info = yield this.source.getInfo();
                this.videoTrack = info.videoTracks[0];
                this.audioTrack = info.audioTracks[0];
            });
        }
        _selectTrack(track) {
            console.assert(!this.selectedTrack, "changing tracks is not implemented");
            this.selectedTrack = track;
            this.source.selectTrack(track);
        }
        _readSample() {
            return __awaiter(this, void 0, void 0, function* () {
                console.assert(this.selectedTrack);
                console.assert(!this._pending_read_resolver);
                if (this.readySamples.length) {
                    return Promise.resolve(this.readySamples.shift());
                }
                let promise = new Promise((resolver) => { this._pending_read_resolver = resolver; });
                console.assert(this._pending_read_resolver);
                this.source.start(this._onSamples.bind(this));
                return promise;
            });
        }
        _onSamples(samples) {
            const SAMPLE_BUFFER_TARGET_SIZE = 50;
            this.readySamples.push(...samples);
            if (this.readySamples.length >= SAMPLE_BUFFER_TARGET_SIZE)
                this.source.stop();
            let firstSampleTime = samples[0].cts * 1000000 / samples[0].timescale;
            webglvideo.debugLog(`adding new ${samples.length} samples (first = ${firstSampleTime}). total = ${this.readySamples.length}`);
            if (this._pending_read_resolver) {
                this._pending_read_resolver(this.readySamples.shift());
                this._pending_read_resolver = null;
            }
        }
    }
    webglvideo.MP4PullDemuxer = MP4PullDemuxer;
    class MP4Source {
        constructor(uri) {
            this.file = MP4Box.createFile();
            this.file.onError = console.error.bind(console);
            this.file.onReady = this.onReady.bind(this);
            this.file.onSamples = this.onSamples.bind(this);
            webglvideo.debugLog('fetching file');
            fetch(uri).then(response => {
                webglvideo.debugLog('fetch responded');
                let resp;
                resp = response.body;
                const reader = resp.getReader();
                let offset = 0;
                let mp4File = this.file;
                function appendBuffers({ done, value }) {
                    if (done) {
                        mp4File.flush();
                        return;
                    }
                    let buf = value.buffer;
                    buf.fileStart = offset;
                    offset += buf.byteLength;
                    mp4File.appendBuffer(buf);
                    return reader.read().then(appendBuffers);
                }
                return reader.read().then(appendBuffers);
            });
            this.info = null;
            this._info_resolver = null;
        }
        onReady(info) {
            // TODO: Generate configuration changes.
            this.info = info;
            if (this._info_resolver) {
                this._info_resolver(info);
                this._info_resolver = null;
            }
        }
        getInfo() {
            if (this.info)
                return Promise.resolve(this.info);
            return new Promise((resolver) => { this._info_resolver = resolver; });
        }
        getAvccBox() {
            // TODO: make sure this is coming from the right track.
            return this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].avcC;
        }
        getAudioSpecificConfig() {
            // TODO: make sure this is coming from the right track.
            // 0x04 is the DecoderConfigDescrTag. Assuming MP4Box always puts this at position 0.
            console.assert(this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].esds.esd.descs[0].tag == 0x04);
            // 0x40 is the Audio OTI, per table 5 of ISO 14496-1
            console.assert(this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].esds.esd.descs[0].oti == 0x40);
            // 0x05 is the DecSpecificInfoTag
            console.assert(this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].esds.esd.descs[0].descs[0].tag == 0x05);
            return this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].esds.esd.descs[0].descs[0].data;
        }
        selectTrack(track) {
            webglvideo.debugLog('selecting track %d' + track.id);
            this.file.setExtractionOptions(track.id);
        }
        start(onSamples) {
            this._onSamples = onSamples;
            this.file.start();
        }
        stop() {
            this.file.stop();
        }
        onSamples(track_id, ref, samples) {
            this._onSamples(samples);
        }
    }
})(webglvideo || (webglvideo = {}));
var webglvideo;
(function (webglvideo) {
    function URLFromFiles(files) {
        const promises = files.map(file => fetch(file).then(response => response.text()));
        return Promise.all(promises).then(texts => {
            const text = texts.join("");
            const blob = new Blob([text], { type: "application/javascript" });
            return URL.createObjectURL(blob);
        });
    }
    // Simple wrapper class for creating AudioWorklet, connecting it to an
    // AudioContext, and controlling audio playback.
    class WebAudioController {
        initialize(sampleRate, channelCount, sharedArrayBuffer) {
            return __awaiter(this, void 0, void 0, function* () {
                // Set up AudioContext to house graph of AudioNodes and control rendering.
                this.audioContext = new AudioContext({
                    sampleRate: sampleRate,
                    latencyHint: "playback"
                });
                this.audioContext.suspend();
                // Make script modules available for execution by AudioWorklet.
                var workletSource = yield URLFromFiles(["./third_party/ringbuf.js", "./third_party/audiosink.js"]);
                yield this.audioContext.audioWorklet.addModule(workletSource);
                // Get an instance of the AudioSink worklet, passing it the memory for a
                // ringbuffer, connect it to a GainNode for volume. This GainNode is in
                // turn connected to the destination.
                this.audioSink = new AudioWorkletNode(this.audioContext, "AudioSink", {
                    processorOptions: {
                        sab: sharedArrayBuffer,
                        mediaChannelCount: channelCount
                    },
                    outputChannelCount: [channelCount]
                });
                this.volumeGainNode = new GainNode(this.audioContext);
                this.audioSink.connect(this.volumeGainNode).connect(this.audioContext.destination);
            });
        }
        setVolume(volume) {
            if (volume < 0.0 && volume > 1.0)
                return;
            // Smooth exponential volume ramps on change
            this.volumeGainNode.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.3);
        }
        play() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.audioContext.resume();
            });
        }
        pause() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.audioContext.suspend();
            });
        }
        getMediaTimeInSeconds() {
            // The currently rendered audio sample is the current time of the
            // AudioContext, offset by the total output latency, that is composed of
            // the internal buffering of the AudioContext (e.g., double buffering), and
            // the inherent latency of the audio playback system: OS buffering,
            // hardware buffering, etc. This starts out negative, because it takes some
            // time to buffer, and crosses zero as the first audio sample is produced
            // by the audio output device.
            let totalOutputLatency = this.audioContext.outputLatency + this.audioContext.baseLatency;
            return Math.max(this.audioContext.currentTime - totalOutputLatency, 0.0);
        }
    }
    webglvideo.WebAudioController = WebAudioController;
})(webglvideo || (webglvideo = {}));
// Video Render  
/// <reference path="glext/defs/videoplayer.d.ts" />
/// <reference path="glext/videoplayer/player_global.ts" />
/// <reference path="glext/videoplayer/pull_demuxer_base.ts" />
/// <reference path="glext/videoplayer/ringbuf.ts" />
/// <reference path="glext/videoplayer/demuxer_mp4.ts" />
/// <reference path="glext/videoplayer/renderer_webgl.ts" />
/// <reference path="glext/videoplayer/audio_renderer.ts" />
/// <reference path="glext/videoplayer/video_renderer.ts" />
/// <reference path="glext/videoplayer/mp4_pull_demuxer.ts" />
/// <reference path="glext/videoplayer/web_audio_controller.ts" />
//# sourceMappingURL=videoplayer.js.map