/* drawingboard.js v0.4.6 - https://github.com/Leimi/drawingboard.js
 * Copyright (c) 2015 Emmanuel Pelletier
 * Licensed MIT */
! function() {
    "use strict";

    function a(a, b) {
        for (; a.length > b;) a.shift()
    }
    var b = function(a) {
        var b = a ? a : {},
            c = {
                provider: function() {
                    throw new Error("No provider!")
                },
                maxLength: 30,
                onUpdate: function() {}
            };
        this.provider = "undefined" != typeof b.provider ? b.provider : c.provider, this.maxLength = "undefined" != typeof b.maxLength ? b.maxLength : c.maxLength, this.onUpdate = "undefined" != typeof b.onUpdate ? b.onUpdate : c.onUpdate, this.initialItem = null, this.clear()
    };
    b.prototype.initialize = function(a) {
        this.stack[0] = a, this.initialItem = a
    }, b.prototype.clear = function() {
        this.stack = [this.initialItem], this.position = 0, this.onUpdate()
    }, b.prototype.save = function() {
        this.provider(function(b) {
            a(this.stack, this.maxLength), this.position = Math.min(this.position, this.stack.length - 1), this.stack = this.stack.slice(0, this.position + 1), this.stack.push(b), this.position++, this.onUpdate()
        }.bind(this))
    }, b.prototype.undo = function(a) {
        if (this.canUndo()) {
            var b = this.stack[--this.position];
            this.onUpdate(), a && a(b)
        }
    }, b.prototype.redo = function(a) {
        if (this.canRedo()) {
            var b = this.stack[++this.position];
            this.onUpdate(), a && a(b)
        }
    }, b.prototype.canUndo = function() {
        return this.position > 0
    }, b.prototype.canRedo = function() {
        return this.position < this.count()
    }, b.prototype.count = function() {
        return this.stack.length - 1
    }, "undefined" != typeof module && (module.exports = b), "undefined" != typeof window && (window.SimpleUndo = b)
}(), window.DrawingBoard = "undefined" != typeof DrawingBoard ? DrawingBoard : {}, DrawingBoard.Utils = {}, DrawingBoard.Utils.tpl = function() {
        "use strict";
        var a, b = "{{",
            c = "}}",
            d = "[a-z0-9_][\\.a-z0-9_]*",
            e = new RegExp(b + "\\s*(" + d + ")\\s*" + c, "gi");
        return function(b, c) {
            return b.replace(e, function(b, d) {
                for (var e = d.split("."), f = e.length, g = c, h = 0; f > h; h++) {
                    if (g = g[e[h]], g === a) throw "tim: '" + e[h] + "' not found in " + b;
                    if (h === f - 1) return g
                }
            })
        }
    }(), DrawingBoard.Utils.MicroEvent = function() {}, DrawingBoard.Utils.MicroEvent.prototype = {
        bind: function(a, b) {
            this._events = this._events || {}, this._events[a] = this._events[a] || [], this._events[a].push(b)
        },
        unbind: function(a, b) {
            this._events = this._events || {}, a in this._events != !1 && this._events[a].splice(this._events[a].indexOf(b), 1)
        },
        trigger: function(a) {
            if (this._events = this._events || {}, a in this._events != !1)
                for (var b = 0; b < this._events[a].length; b++) this._events[a][b].apply(this, Array.prototype.slice.call(arguments, 1))
        }
    }, DrawingBoard.Utils._boxBorderSize = function(a, b, c, d) {
        b = !!b || !0, c = !!c || !1;
        var e, f = 0;
        "width" == d ? (e = ["border-left-width", "border-right-width"], b && e.push("padding-left", "padding-right"), c && e.push("margin-left", "margin-right")) : (e = ["border-top-width", "border-bottom-width"], b && e.push("padding-top", "padding-bottom"), c && e.push("margin-top", "margin-bottom"));
        for (var g = e.length - 1; g >= 0; g--) f += parseInt(a.css(e[g]).replace("px", ""), 10);
        return f
    }, DrawingBoard.Utils.boxBorderWidth = function(a, b, c) {
        return DrawingBoard.Utils._boxBorderSize(a, b, c, "width")
    }, DrawingBoard.Utils.boxBorderHeight = function(a, b, c) {
        return DrawingBoard.Utils._boxBorderSize(a, b, c, "height")
    }, DrawingBoard.Utils.isColor = function(a) {
        return a && a.length ? /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a) || -1 !== $.inArray(a.substring(0, 3), ["rgb", "hsl"]) : !1
    }, DrawingBoard.Utils.RGBToInt = function(a, b, c) {
        var d = 0;
        return d |= (255 & a) << 16, d |= (255 & b) << 8, d |= 255 & c
    }, DrawingBoard.Utils.pixelAt = function(a, b, c) {
        var d = 4 * (c * a.width + b),
            e = DrawingBoard.Utils.RGBToInt(a.data[d], a.data[d + 1], a.data[d + 2]);
        return [d, b, c, e]
    }, DrawingBoard.Utils.compareColors = function(a, b, c) {
        if (0 === c) return a === b;
        var d = a >> 16 & 255,
            e = b >> 16 & 255,
            f = a >> 8 & 255,
            g = b >> 8 & 255,
            h = 255 & a,
            i = 255 & b;
        return Math.abs(d - e) <= c && Math.abs(f - g) <= c && Math.abs(h - i) <= c
    },
    function() {
        for (var a = ["ms", "moz", "webkit", "o"], b = 0; b < a.length && !window.requestAnimationFrame; ++b) window.requestAnimationFrame = window[a[b] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[a[b] + "CancelAnimationFrame"] || window[a[b] + "CancelRequestAnimationFrame"]
    }(), window.DrawingBoard = "undefined" != typeof DrawingBoard ? DrawingBoard : {}, DrawingBoard.Board = function(a, b) {
        if (this.opts = this.mergeOptions(b), this.ev = new DrawingBoard.Utils.MicroEvent, this.id = a, this.$el = $(document.getElementById(a)), !this.$el.length) return !1;
        var c = '<div class="drawing-board-canvas-wrapper"></canvas><canvas class="drawing-board-canvas" id="canvasiko"></canvas><div class="drawing-board-cursor drawing-board-utils-hidden"></div></div>';
        return this.opts.controlsPosition.indexOf("bottom") > -1 ? c += '<div class="drawing-board-controls"></div>' : c = '<div class="drawing-board-controls"></div>' + c, this.$el.addClass("drawing-board").append(c), this.dom = {
            $canvasWrapper: this.$el.find(".drawing-board-canvas-wrapper"),
            $canvas: this.$el.find(".drawing-board-canvas"),
            $cursor: this.$el.find(".drawing-board-cursor"),
            $controls: this.$el.find(".drawing-board-controls")
        }, $.each(["left", "right", "center"], $.proxy(function(a, b) {
            return this.opts.controlsPosition.indexOf(b) > -1 ? (this.dom.$controls.attr("data-align", b), !1) : void 0
        }, this)), this.canvas = this.dom.$canvas.get(0), this.ctx = this.canvas && this.canvas.getContext && this.canvas.getContext("2d") ? this.canvas.getContext("2d") : null, this.color = this.opts.color, this.ctx ? (this.storage = this._getStorage(), this.initHistory(), this.reset({
            webStorage: !1,
            history: !1,
            background: !1
        }), this.initControls(), this.resize(), this.reset({
            webStorage: !1,
            history: !1,
            background: !0
        }), this.restoreWebStorage(), this.initDropEvents(), void this.initDrawEvents()) : (this.opts.errorMessage && this.$el.html(this.opts.errorMessage), !1)
    }, DrawingBoard.Board.defaultOpts = {
        controls: ["Color", "DrawingMode", "Size", "Navigation"],
        controlsPosition: "top left",
        color: "#000000",
        size: 15,
        background: "#fff",
        eraserColor: "background",
        fillTolerance: 100,
        fillHack: !0,
        webStorage: "session",
        droppable: !1,
        enlargeYourContainer: !1,
        errorMessage: '<p>It seems you use an obsolete browser. <a href="http://browsehappy.com/" target="_blank">Update it</a> to start drawing.</p>',
        stretchImg: !1
    }, DrawingBoard.Board.prototype = {
        mergeOptions: function(a) {
            return a = $.extend({}, DrawingBoard.Board.defaultOpts, a), a.background || "background" !== a.eraserColor || (a.eraserColor = "transparent"), a
        },
        reset: function(a) {
            a = $.extend({
                color: this.opts.color,
                size: this.opts.size,
                webStorage: !0,
                history: !0,
                background: !1
            }, a), this.setMode("pencil"), a.background && this.resetBackground(this.opts.background, $.proxy(function() {
                a.history && this.saveHistory()
            }, this)), a.color && this.setColor(a.color), a.size && (this.ctx.lineWidth = a.size), this.ctx.lineCap = "round", this.ctx.lineJoin = "round", a.webStorage && this.saveWebStorage(), a.history && !a.background && this.saveHistory(), this.blankCanvas = this.getImg(), this.ev.trigger("board:reset", a)
        },
        resetBackground: function(a, b) {
            a = a || this.opts.background;
            var c = DrawingBoard.Utils.isColor(a),
                d = this.getMode();
            this.setMode("pencil"), this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height), c ? (this.ctx.fillStyle = a, this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height), this.history.initialize(this.getImg()), b && b()) : a && this.setImg(a, {
                callback: $.proxy(function() {
                    this.history.initialize(this.getImg()), b && b()
                }, this)
            }), this.setMode(d)
        },
        resize: function() {
            this.dom.$controls.toggleClass("drawing-board-controls-hidden", !this.controls || !this.controls.length);
            var a, b, c = [this.$el.width(), DrawingBoard.Utils.boxBorderWidth(this.$el), DrawingBoard.Utils.boxBorderWidth(this.dom.$canvasWrapper, !0, !0)],
                d = [this.$el.height(), DrawingBoard.Utils.boxBorderHeight(this.$el), this.dom.$controls.height(), DrawingBoard.Utils.boxBorderHeight(this.dom.$controls, !1, !0), DrawingBoard.Utils.boxBorderHeight(this.dom.$canvasWrapper, !0, !0)],
                e = function(a, b) {
                    b = b || 1;
                    for (var c = a[0], d = 1; d < a.length; d++) c += a[d] * b;
                    return c
                },
                f = function(a) {
                    return e(a, -1)
                };
            this.opts.enlargeYourContainer ? (a = this.$el.width(), b = this.$el.height(), this.$el.width(e(c)), this.$el.height(e(d))) : (a = f(c), b = f(d)), this.dom.$canvasWrapper.css("width", a + "px"), this.dom.$canvasWrapper.css("height", b + "px"), this.dom.$canvas.css("width", a + "px"), this.dom.$canvas.css("height", b + "px"), this.canvas.width = a, this.canvas.height = b
        },
        initControls: function() {
            if (this.controls = [], !this.opts.controls.length || !DrawingBoard.Control) return !1;
            for (var a = 0; a < this.opts.controls.length; a++) {
                var b = null;
                if ("string" == typeof this.opts.controls[a]) b = new window.DrawingBoard.Control[this.opts.controls[a]](this);
                else if ("object" == typeof this.opts.controls[a]) {
                    for (var c in this.opts.controls[a]) break;
                    b = new window.DrawingBoard.Control[c](this, this.opts.controls[a][c])
                }
                b && this.addControl(b)
            }
        },
        addControl: function(a, b, c) {
            if ("string" != typeof a && ("object" != typeof a || !a instanceof DrawingBoard.Control)) return !1;
            var d = "object" == typeof b ? b : {};
            c = c ? 1 * c : "number" == typeof b ? b : null, "string" == typeof a && (a = new window.DrawingBoard.Control[a](this, d)), c ? this.dom.$controls.children().eq(c).before(a.$el) : this.dom.$controls.append(a.$el), this.controls || (this.controls = []), this.controls.push(a), this.dom.$controls.removeClass("drawing-board-controls-hidden")
        },
        initHistory: function() {
            this.history = new SimpleUndo({
                maxLength: 30,
                provider: $.proxy(function(a) {
                    a(this.getImg())
                }, this),
                onUpdate: $.proxy(function() {
                    this.ev.trigger("historyNavigation")
                }, this)
            })
        },
        saveHistory: function() {
            this.history.save()
        },
        restoreHistory: function(a) {
            this.setImg(a, {
                callback: $.proxy(function() {
                    this.saveWebStorage()
                }, this)
            })
        },
        goBackInHistory: function() {
            this.history.undo($.proxy(this.restoreHistory, this))
        },
        goForthInHistory: function() {
            this.history.redo($.proxy(this.restoreHistory, this))
        },
        setImg: function(a, b) {
            b = $.extend({
                stretch: this.opts.stretchImg,
                callback: null
            }, b);
            var c = this.ctx,
                d = new Image,
                e = c.globalCompositeOperation;
            d.onload = function() {
                c.globalCompositeOperation = "source-over", c.clearRect(0, 0, c.canvas.width, c.canvas.height), b.stretch ? c.drawImage(d, 0, 0, c.canvas.width, c.canvas.height) : c.drawImage(d, 0, 0), c.globalCompositeOperation = e, b.callback && b.callback()
            }, d.src = a
        },
        getImg: function() {
            return this.canvas.toDataURL("image/png")
        },
        downloadImg: function() {
            var a = this.getImg();
            a = a.replace("image/png", "image/octet-stream"), window.location.href = a
        },
        saveWebStorage: function() {
            window[this.storage] && (window[this.storage].setItem("drawing-board-" + this.id, this.getImg()), this.ev.trigger("board:save" + this.storage.charAt(0).toUpperCase() + this.storage.slice(1), this.getImg()))
        },
        restoreWebStorage: function() {
            window[this.storage] && null !== window[this.storage].getItem("drawing-board-" + this.id) && (this.setImg(window[this.storage].getItem("drawing-board-" + this.id)), this.ev.trigger("board:restore" + this.storage.charAt(0).toUpperCase() + this.storage.slice(1), window[this.storage].getItem("drawing-board-" + this.id)))
        },
        clearWebStorage: function() {
            window[this.storage] && null !== window[this.storage].getItem("drawing-board-" + this.id) && (window[this.storage].removeItem("drawing-board-" + this.id), this.ev.trigger("board:clear" + this.storage.charAt(0).toUpperCase() + this.storage.slice(1)))
        },
        _getStorage: function() {
            return !this.opts.webStorage || "session" !== this.opts.webStorage && "local" !== this.opts.webStorage ? !1 : this.opts.webStorage + "Storage"
        },
        initDropEvents: function() {
            return this.opts.droppable ? (this.dom.$canvas.on("dragover dragenter drop", function(a) {
                a.stopPropagation(), a.preventDefault()
            }), void this.dom.$canvas.on("drop", $.proxy(this._onCanvasDrop, this))) : !1
        },
        _onCanvasDrop: function(a) {
            a = a.originalEvent ? a.originalEvent : a;
            var b = a.dataTransfer.files;
            if (!b || !b.length || -1 == b[0].type.indexOf("image") || !window.FileReader) return !1;
            var c = new FileReader;
            c.readAsDataURL(b[0]), c.onload = $.proxy(function(a) {
                this.setImg(a.target.result, {
                    callback: $.proxy(function() {
                        this.saveHistory()
                    }, this)
                }), this.ev.trigger("board:imageDropped", a.target.result), this.ev.trigger("board:userAction")
            }, this)
        },
        setMode: function(a, b) {
            b = b || !1, a = a || "pencil", this.ev.unbind("board:startDrawing", $.proxy(this.fill, this)), "transparent" === this.opts.eraserColor ? this.ctx.globalCompositeOperation = "eraser" === a ? "destination-out" : "source-over" : ("eraser" === a ? "background" === this.opts.eraserColor && DrawingBoard.Utils.isColor(this.opts.background) ? this.ctx.strokeStyle = this.opts.background : DrawingBoard.Utils.isColor(this.opts.eraserColor) && (this.ctx.strokeStyle = this.opts.eraserColor) : this.mode && "eraser" !== this.mode || (this.ctx.strokeStyle = this.color), "filler" === a && this.ev.bind("board:startDrawing", $.proxy(this.fill, this))), this.mode = a, b || this.ev.trigger("board:mode", this.mode)
        },
        getMode: function() {
            return this.mode || "pencil"
        },
        setColor: function(a) {
            var b = this;
            if (a = a || this.color, !DrawingBoard.Utils.isColor(a)) return !1;
            if (this.color = a, "transparent" !== this.opts.eraserColor && "eraser" === this.mode) {
                var c = function(a) {
                    "eraser" !== a && (b.strokeStyle = b.color), b.ev.unbind("board:mode", c)
                };
                this.ev.bind("board:mode", c)
            } else this.ctx.strokeStyle = this.color
        },
        fill: function(a) {
            function b(a) {
                c.data[a[d]] = i, c.data[a[d] + 1] = j, c.data[a[d] + 2] = k
            }
            if (this.getImg() === this.blankCanvas) return this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height), this.ctx.fillStyle = this.color, void this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            var c = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
                d = 0,
                e = 1,
                f = 2,
                g = 3,
                h = this.ctx.strokeStyle,
                i = parseInt(h.substr(1, 2), 16),
                j = parseInt(h.substr(3, 2), 16),
                k = parseInt(h.substr(5, 2), 16),
                l = DrawingBoard.Utils.pixelAt(c, parseInt(a.coords.x, 10), parseInt(a.coords.y, 10)),
                m = l[g],
                n = this.opts.fillTolerance,
                o = this.opts.fillHack;
            if (!DrawingBoard.Utils.compareColors(m, DrawingBoard.Utils.RGBToInt(i, j, k), n)) {
                for (var p, q = [l], r = c.width - 1, s = c.height - 1; p = q.pop();) o && b(p), DrawingBoard.Utils.compareColors(p[g], m, n) && (o || b(p), p[e] > 0 && q.push(DrawingBoard.Utils.pixelAt(c, p[e] - 1, p[f])), p[e] < r && q.push(DrawingBoard.Utils.pixelAt(c, p[e] + 1, p[f])), p[f] > 0 && q.push(DrawingBoard.Utils.pixelAt(c, p[e], p[f] - 1)), p[f] < s && q.push(DrawingBoard.Utils.pixelAt(c, p[e], p[f] + 1)));
                this.ctx.putImageData(c, 0, 0)
            }
        },
        initDrawEvents: function() {
            this.isDrawing = !1, this.isMouseHovering = !1, this.coords = {}, this.coords.old = this.coords.current = this.coords.oldMid = {
                x: 0,
                y: 0
            }, this.dom.$canvas.on("mousedown touchstart", $.proxy(function(a) {
                this._onInputStart(a, this._getInputCoords(a))
            }, this)), this.dom.$canvas.on("mousemove touchmove", $.proxy(function(a) {
                this._onInputMove(a, this._getInputCoords(a))
            }, this)), this.dom.$canvas.on("mousemove", $.proxy(function() {}, this)), this.dom.$canvas.on("mouseup touchend", $.proxy(function(a) {
                this._onInputStop(a, this._getInputCoords(a))
            }, this)), this.dom.$canvas.on("mouseover", $.proxy(function(a) {
                this._onMouseOver(a, this._getInputCoords(a))
            }, this)), this.dom.$canvas.on("mouseout", $.proxy(function(a) {
                this._onMouseOut(a, this._getInputCoords(a))
            }, this)), $("body").on("mouseup touchend", $.proxy(function() {
                this.isDrawing = !1
            }, this)), window.requestAnimationFrame && requestAnimationFrame($.proxy(this.draw, this))
        },
        draw: function() {
            if (window.requestAnimationFrame && this.ctx.lineWidth > 10 && this.isMouseHovering) {
                this.dom.$cursor.css({
                    width: this.ctx.lineWidth + "px",
                    height: this.ctx.lineWidth + "px"
                });
                var a = DrawingBoard.Utils.tpl("translateX({{x}}px) translateY({{y}}px)", {
                    x: this.coords.current.x - this.ctx.lineWidth / 2,
                    y: this.coords.current.y - this.ctx.lineWidth / 2
                });
                this.dom.$cursor.css({
                    transform: a,
                    "-webkit-transform": a,
                    "-ms-transform": a
                }), this.dom.$cursor.removeClass("drawing-board-utils-hidden")
            } else this.dom.$cursor.addClass("drawing-board-utils-hidden");
            if (this.isDrawing) {
                var b = this._getMidInputCoords(this.coords.current);
                this.ctx.beginPath(), this.ctx.moveTo(b.x, b.y), this.ctx.quadraticCurveTo(this.coords.old.x, this.coords.old.y, this.coords.oldMid.x, this.coords.oldMid.y), this.ctx.stroke(), this.coords.old = this.coords.current, this.coords.oldMid = b
            }
            window.requestAnimationFrame && requestAnimationFrame($.proxy(function() {
                this.draw()
            }, this))
        },
        _onInputStart: function(a, b) {
            this.coords.current = this.coords.old = b, this.coords.oldMid = this._getMidInputCoords(b), this.isDrawing = !0, window.requestAnimationFrame || this.draw(), this.ev.trigger("board:startDrawing", {
                e: a,
                coords: b
            }), a.stopPropagation(), a.preventDefault()
        },
        _onInputMove: function(a, b) {
            this.coords.current = b, this.ev.trigger("board:drawing", {
                e: a,
                coords: b
            }), window.requestAnimationFrame || this.draw(), a.stopPropagation(), a.preventDefault()
        },
        _onInputStop: function(a, b) {
            !this.isDrawing || a.touches && 0 !== a.touches.length || (this.isDrawing = !1, this.saveWebStorage(), this.saveHistory(), this.ev.trigger("board:stopDrawing", {
                e: a,
                coords: b
            }), this.ev.trigger("board:userAction"), a.stopPropagation(), a.preventDefault())
        },
        _onMouseOver: function(a, b) {
            this.isMouseHovering = !0, this.coords.old = this._getInputCoords(a), this.coords.oldMid = this._getMidInputCoords(this.coords.old), this.ev.trigger("board:mouseOver", {
                e: a,
                coords: b
            })
        },
        _onMouseOut: function(a, b) {
            this.isMouseHovering = !1, this.ev.trigger("board:mouseOut", {
                e: a,
                coords: b
            })
        },
        _getInputCoords: function(a) {
            a = a.originalEvent ? a.originalEvent : a;
            var b, c, d = this.canvas.getBoundingClientRect(),
                e = this.dom.$canvas.width(),
                f = this.dom.$canvas.height();
            return a.touches && 1 == a.touches.length ? (b = a.touches[0].pageX, c = a.touches[0].pageY) : (b = a.pageX, c = a.pageY), b -= this.dom.$canvas.offset().left, c -= this.dom.$canvas.offset().top, b *= e / d.width, c *= f / d.height, {
                x: b,
                y: c
            }
        },
        _getMidInputCoords: function(a) {
            return {
                x: this.coords.old.x + a.x >> 1,
                y: this.coords.old.y + a.y >> 1
            }
        }
    }, DrawingBoard.Control = function(a, b) {
        return this.board = a, this.opts = $.extend({}, this.defaults, b), this.$el = $(document.createElement("div")).addClass("drawing-board-control"), this.name && this.$el.addClass("drawing-board-control-" + this.name), this.board.ev.bind("board:reset", $.proxy(this.onBoardReset, this)), this.initialize.apply(this, arguments), this
    }, DrawingBoard.Control.prototype = {
        name: "",
        defaults: {},
        initialize: function() {},
        addToBoard: function() {
            this.board.addControl(this)
        },
        onBoardReset: function() {}
    }, DrawingBoard.Control.extend = function(a, b) {
        var c, d = this;
        c = a && a.hasOwnProperty("constructor") ? a.constructor : function() {
            return d.apply(this, arguments)
        }, $.extend(c, d, b);
        var e = function() {
            this.constructor = c
        };
        return e.prototype = d.prototype, c.prototype = new e, a && $.extend(c.prototype, a), c.__super__ = d.prototype, c
    }, DrawingBoard.Control.Color = DrawingBoard.Control.extend({
        name: "colors",
        initialize: function() {
            this.initTemplate();
            var a = this;
            this.$el.on("click", ".drawing-board-control-colors-picker", function(b) {
                var c = $(this).attr("data-color");
                a.board.setColor(c), a.$el.find(".drawing-board-control-colors-current").css("background-color", c).attr("data-color", c), a.board.ev.trigger("color:changed", c), a.$el.find(".drawing-board-control-colors-rainbows").addClass("drawing-board-utils-hidden"), b.preventDefault()
            }), this.$el.on("click", ".drawing-board-control-colors-current", function(b) {
                a.$el.find(".drawing-board-control-colors-rainbows").toggleClass("drawing-board-utils-hidden"), b.preventDefault()
            }), $("body").on("click", function(b) {
                var c = $(b.target),
                    d = c.hasClass("drawing-board-control-colors-current") ? c : c.closest(".drawing-board-control-colors-current"),
                    e = a.$el.find(".drawing-board-control-colors-current"),
                    f = a.$el.find(".drawing-board-control-colors-rainbows");
                d.length && d.get(0) === e.get(0) || f.hasClass("drawing-board-utils-hidden") || f.addClass("drawing-board-utils-hidden")
            })
        },
        initTemplate: function() {
            var a = '<div class="drawing-board-control-inner"><div class="drawing-board-control-colors-current" style="background-color: {{color}}" data-color="{{color}}"></div><div class="drawing-board-control-colors-rainbows">{{rainbows}}</div></div>',
                b = '<div class="drawing-board-control-colors-picker" data-color="{{color}}" style="background-color: {{color}}"></div>',
                c = "";
            $.each([.75, .5, .25], $.proxy(function(a, d) {
                var e = 0,
                    f = null;
                for (c += '<div class="drawing-board-control-colors-rainbow">', .25 == d && (f = this._rgba(0, 0, 0, 1)), .5 == d && (f = this._rgba(150, 150, 150, 1)), .75 == d && (f = this._rgba(255, 255, 255, 1)), c += DrawingBoard.Utils.tpl(b, {
                        color: f.toString()
                    }); 330 >= e;) c += DrawingBoard.Utils.tpl(b, {
                    color: this._hsl2Rgba(this._hsl(e - 60, 1, d)).toString()
                }), e += 30;
                c += "</div>"
            }, this)), this.$el.append($(DrawingBoard.Utils.tpl(a, {
                color: this.board.color,
                rainbows: c
            }))), this.$el.find(".drawing-board-control-colors-rainbows").addClass("drawing-board-utils-hidden")
        },
        onBoardReset: function() {
            this.board.setColor(this.$el.find(".drawing-board-control-colors-current").attr("data-color"))
        },
        _rgba: function(a, b, c, d) {
            return {
                r: a,
                g: b,
                b: c,
                a: d,
                toString: function() {
                    return "rgba(" + a + ", " + b + ", " + c + ", " + d + ")"
                }
            }
        },
        _hsl: function(a, b, c) {
            return {
                h: a,
                s: b,
                l: c,
                toString: function() {
                    return "hsl(" + a + ", " + 100 * b + "%, " + 100 * c + "%)"
                }
            }
        },
        _hex2Rgba: function(a) {
            var b = parseInt(a.substring(1), 16);
            return this._rgba(b >> 16, b >> 8 & 255, 255 & b, 1)
        },
        _hsl2Rgba: function(a) {
            function b(a, b, c) {
                return 0 > c && (c += 1), c > 1 && (c -= 1), 1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a
            }
            var c, d, e, f = a.h / 360,
                g = a.s,
                h = a.l;
            if (0 === g) c = d = e = h;
            else {
                var i = .5 > h ? h * (1 + g) : h + g - h * g,
                    j = 2 * h - i;
                c = Math.floor(255 * b(j, i, f + 1 / 3)), d = Math.floor(255 * b(j, i, f)), e = Math.floor(255 * b(j, i, f - 1 / 3))
            }
            return this._rgba(c, d, e, 1)
        }
    }), DrawingBoard.Control.DrawingMode = DrawingBoard.Control.extend({
        name: "drawingmode",
        defaults: {
            pencil: !0,
            eraser: !0,
            filler: !0
        },
        initialize: function() {
            this.prevMode = this.board.getMode(), $.each(["pencil", "eraser", "filler"], $.proxy(function(a, b) {
                this.opts[b] && this.$el.append('<button class="drawing-board-control-drawingmode-' + b + '-button" data-mode="' + b + '"></button>')
            }, this)), this.$el.on("click", "button[data-mode]", $.proxy(function(a) {
                var b = $(a.currentTarget).attr("data-mode"),
                    c = this.board.getMode();
                c !== b && (this.prevMode = c);
                var d = c === b ? this.prevMode : b;
                this.board.setMode(d), a.preventDefault()
            }, this)), this.board.ev.bind("board:mode", $.proxy(function(a) {
                this.toggleButtons(a)
            }, this)), this.toggleButtons(this.board.getMode())
        },
        toggleButtons: function(a) {
            this.$el.find("button[data-mode]").each(function(b, c) {
                var d = $(c);
                d.toggleClass("active", a === d.attr("data-mode"))
            })
        }
    }), DrawingBoard.Control.Navigation = DrawingBoard.Control.extend({
        name: "navigation",
        defaults: {
            back: !0,
            forward: !0,
            reset: !0
        },
        initialize: function() {
            var a = "";
            if (this.opts.back && (a += '<button class="drawing-board-control-navigation-back">&larr;</button>'), this.opts.forward && (a += '<button class="drawing-board-control-navigation-forward">&rarr;</button>'), this.opts.reset && (a += '<button class="drawing-board-control-navigation-reset">&times;</button>'), this.$el.append(a), this.opts.back) {
                var b = this.$el.find(".drawing-board-control-navigation-back");
                this.board.ev.bind("historyNavigation", $.proxy(this.updateBack, this, b)), this.$el.on("click", ".drawing-board-control-navigation-back", $.proxy(function(a) {
                    this.board.goBackInHistory(), a.preventDefault()
                }, this)), this.updateBack(b)
            }
            if (this.opts.forward) {
                var c = this.$el.find(".drawing-board-control-navigation-forward");
                this.board.ev.bind("historyNavigation", $.proxy(this.updateForward, this, c)), this.$el.on("click", ".drawing-board-control-navigation-forward", $.proxy(function(a) {
                    this.board.goForthInHistory(), a.preventDefault()
                }, this)), this.updateForward(c)
            }
            this.opts.reset && this.$el.on("click", ".drawing-board-control-navigation-reset", $.proxy(function(a) {
                this.board.reset({
                    background: !0
                }), a.preventDefault()
            }, this))
        },
        updateBack: function(a) {
            this.board.history.canUndo() ? a.removeAttr("disabled") : a.attr("disabled", "disabled")
        },
        updateForward: function(a) {
            this.board.history.canRedo() ? a.removeAttr("disabled") : a.attr("disabled", "disabled")
        }
    }), DrawingBoard.Control.Size = DrawingBoard.Control.extend({
        name: "size",
        defaults: {
            type: "auto",
            dropdownValues: [1, 3, 6, 10, 20, 30, 40, 50],
            min: 1,
            max: 50
        },
        types: ["dropdown", "range"],
        initialize: function() {
            "auto" == this.opts.type && (this.opts.type = this._iHasRangeInput() ? "range" : "dropdown");
            var a = $.inArray(this.opts.type, this.types) > -1 ? this["_" + this.opts.type + "Template"]() : !1;
            if (!a) return !1;
            this.val = this.board.opts.size, this.$el.append($(a)), this.$el.attr("data-drawing-board-type", this.opts.type), this.updateView();
            var b = this;
            "range" == this.opts.type && this.$el.on("change", ".drawing-board-control-size-range-input", function(a) {
                b.val = $(this).val(), b.updateView(), b.board.ev.trigger("size:changed", b.val), a.preventDefault()
            }), "dropdown" == this.opts.type && (this.$el.on("click", ".drawing-board-control-size-dropdown-current", $.proxy(function() {
                this.$el.find(".drawing-board-control-size-dropdown").toggleClass("drawing-board-utils-hidden")
            }, this)), this.$el.on("click", "[data-size]", function(a) {
                b.val = parseInt($(this).attr("data-size"), 0), b.updateView(), b.board.ev.trigger("size:changed", b.val), a.preventDefault()
            }))
        },
        _rangeTemplate: function() {
            var a = '<div class="drawing-board-control-inner" title="{{size}}"><input type="range" min="{{min}}" max="{{max}}" value="{{size}}" step="1" class="drawing-board-control-size-range-input"><span class="drawing-board-control-size-range-current"></span></div>';
            return DrawingBoard.Utils.tpl(a, {
                min: this.opts.min,
                max: this.opts.max,
                size: this.board.opts.size
            })
        },
        _dropdownTemplate: function() {
            var a = '<div class="drawing-board-control-inner" title="{{size}}"><div class="drawing-board-control-size-dropdown-current"><span></span></div><ul class="drawing-board-control-size-dropdown">';
            return $.each(this.opts.dropdownValues, function(b, c) {
                a += DrawingBoard.Utils.tpl('<li data-size="{{size}}"><span style="width: {{size}}px; height: {{size}}px; border-radius: {{size}}px;"></span></li>', {
                    size: c
                })
            }), a += "</ul></div>"
        },
        onBoardReset: function() {
            this.updateView()
        },
        updateView: function() {
            var a = this.val;
            if (this.board.ctx.lineWidth = a, this.$el.find(".drawing-board-control-size-range-current, .drawing-board-control-size-dropdown-current span").css({
                    width: a + "px",
                    height: a + "px",
                    borderRadius: a + "px",
                    marginLeft: -1 * a / 2 + "px",
                    marginTop: -1 * a / 2 + "px"
                }), this.$el.find(".drawing-board-control-inner").attr("title", a), "dropdown" == this.opts.type) {
                var b = null;
                $.each(this.opts.dropdownValues, function(c, d) {
                    (null === b || Math.abs(d - a) < Math.abs(b - a)) && (b = d)
                }), this.$el.find(".drawing-board-control-size-dropdown").addClass("drawing-board-utils-hidden")
            }
        },
        _iHasRangeInput: function() {
            var a, b = document.createElement("input"),
                c = ":)",
                d = document.documentElement,
                e = "range";
            return b.setAttribute("type", e), a = "text" !== b.type, b.value = c, b.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(e) && void 0 !== b.style.WebkitAppearance && (d.appendChild(b), defaultView = document.defaultView, a = defaultView.getComputedStyle && "textfield" !== defaultView.getComputedStyle(b, null).WebkitAppearance && 0 !== b.offsetHeight, d.removeChild(b)), !!a
        }
    }), DrawingBoard.Control.Download = DrawingBoard.Control.extend({
        name: "download",
        initialize: function() {
            this.$el.append('<button class="drawing-board-control-download-button"></button>'), this.$el.on("click", ".drawing-board-control-download-button", $.proxy(function(a) {
                this.board.downloadImg(), a.preventDefault()
            }, this))
        }
    });
