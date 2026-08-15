export class WebGLFilterEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.isSupported = !!this.gl;
        this.program = null;
        if (this.isSupported) {
            this.initShaders();
        }
    }

    initShaders() {
        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        const fsSource = `
            precision mediump float;
            uniform sampler2D u_image;
            uniform float u_brightness;
            uniform float u_contrast;
            varying vec2 v_texCoord;
            void main() {
                vec4 color = texture2D(u_image, v_texCoord);
                vec3 bright = color.rgb * u_brightness;
                vec3 contrast = (bright - 0.5) * u_contrast + 0.5;
                gl_FragColor = vec4(clamp(contrast, 0.0, 1.0), color.a);
            }
        `;

        const vs = this.compileShader(this.gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource);
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    render(image, brightness = 1.0, contrast = 1.0) {
        if (!this.isSupported || !this.program) return false;
        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        return true;
    }
}