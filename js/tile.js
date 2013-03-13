// Generated by CoffeeScript 1.6.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(document).ready(function() {
    var Block, Tile, gridMid, gridh, gridw;
    gridw = 12;
    gridh = 20;
    gridMid = gridw / 2;
    Tile = (function() {

      function Tile() {}

      Tile.tilew = Tile.tileh = 20;

      Tile.canvas = canvasInfo;

      Tile.tile = new Array(gridh);

      Tile.initTile = function() {
        var i, j, row, _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= gridh ? _i < gridh : _i > gridh; i = 0 <= gridh ? ++_i : --_i) {
          row = new Array(gridw);
          this.tile[i] = row;
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (j = _j = 0; 0 <= gridw ? _j < gridw : _j > gridw; j = 0 <= gridw ? ++_j : --_j) {
              _results1.push(this.tile[i][j] = {
                x: this.canvas.sx + j * this.tilew,
                y: this.canvas.sy + i * this.tileh,
                fill: false
              });
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      Tile.eachTile = function(fun) {
        var i, j, _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= gridh ? _i < gridh : _i > gridh; i = 0 <= gridh ? ++_i : --_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (j = _j = 0; 0 <= gridw ? _j < gridw : _j > gridw; j = 0 <= gridw ? ++_j : --_j) {
              _results1.push(fun.call(this, this.tile[i][j]));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      Tile.clearTile = function(x, y) {
        this.tile[x][y].fill = false;
        return this.drawTile(x, y);
      };

      Tile.drawTile = function(x, y, colour) {
        var ctx, tile;
        if (colour == null) {
          colour = "rgb(255,255,255)";
        }
        tile = this.tile[x][y];
        ctx = this.canvas.ctx();
        ctx.fillStyle = colour;
        return ctx.fillRect(tile.x, tile.y, this.tilew, this.tileh);
      };

      Tile.isHit = function(row, cow) {
        if ((0 <= row && row < gridh) && (0 <= cow && cow < gridw)) {
          return this.tile[row][cow].fill;
        } else {
          return true;
        }
      };

      Tile.moveTile = function(x, y) {
        this.tile[x + 1][y].fill = this.tile[x][y].fill;
        if (this.tile[x + 1][y].fill) {
          return this.drawTile(x + 1, y, "rgb(0,255,0)");
        } else {
          return this.drawTile(x + 1, y, "rgb(255,255,255)");
        }
      };

      Tile.refresh = function() {
        var full, i, j, k, p, q, _i, _j, _k, _l, _ref, _results;
        console.log("rerere");
        i = gridh - 1;
        _results = [];
        while (i >= 0) {
          full = true;
          for (j = _i = 0; 0 <= gridw ? _i < gridw : _i > gridw; j = 0 <= gridw ? ++_i : --_i) {
            if (this.tile[i][j].fill === false) {
              full = false;
              break;
            }
          }
          if (full === true) {
            console.log(full);
            for (k = _j = 0; 0 <= gridw ? _j < gridw : _j > gridw; k = 0 <= gridw ? ++_j : --_j) {
              this.clearTile(i, k);
            }
            for (p = _k = _ref = i - 1; _ref <= 0 ? _k <= 0 : _k >= 0; p = _ref <= 0 ? ++_k : --_k) {
              for (q = _l = 0; 0 <= gridw ? _l < gridw : _l > gridw; q = 0 <= gridw ? ++_l : --_l) {
                this.moveTile(p, q);
              }
            }
            i++;
          }
          _results.push(i--);
        }
        return _results;
      };

      return Tile;

    })();
    Block = (function() {

      Block.BlockType = ["straight4", "left3", "right3", "all3", "left2", "right2", "all2"];

      Block.randomBlock = function() {
        var num;
        num = Math.floor(Math.random() * 7);
        return this.BlockType[num];
      };

      Block.prototype.straight4 = function() {
        var co, n, _i, _len, _ref,
          _this = this;
        this.roof = [0, gridMid];
        this.bottom = [3, gridMid];
        this.all = (function() {
          var _i, _results;
          _results = [];
          for (n = _i = 0; _i <= 3; n = ++_i) {
            _results.push([n, gridMid]);
          }
          return _results;
        })();
        _ref = this.all;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          co = _ref[_i];
          Tile.tile[co[0]][co[1]].fill = true;
        }
        return this.transform = function() {
          var bottom, i, roof, _j, _k, _l, _len1, _len2, _len3, _ref1, _ref2, _ref3;
          i = 0;
          if (_this.form === 1) {
            if (!Tile.isHit(_this.roof[0], _this.roof[1] + 3)) {
              _ref1 = _this.all.slice(1, 4);
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                co = _ref1[_j];
                i += 1;
                co[0] -= i;
                co[1] += i;
              }
              _this.form = 2;
            } else {
              console.log("babab");
            }
          } else {
            if (!Tile.isHit(_this.bottom[0] + 3, _this.bottom[1])) {
              _ref2 = _this.all.slice(1, 4);
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                co = _ref2[_k];
                i += 1;
                co[0] += i;
                co[1] -= i;
              }
              _this.form = 1;
            }
          }
          roof = bottom = null;
          _ref3 = _this.all;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            co = _ref3[_l];
            Tile.tile[co[0]][co[1]].fill = true;
            if (roof == null) {
              roof = co;
            }
            if (co[0] < roof[0]) {
              roof = co;
            }
            if (bottom == null) {
              bottom = co;
            }
            if (co[0] > roof[0]) {
              bottom = co;
            }
          }
          _this.roof = roof;
          return _this.bottom = bottom;
        };
      };

      Block.prototype.all2 = function() {
        this.all = [[1, gridMid], [0, gridMid], [0, gridMid + 1], [1, gridMid + 1]];
        return this.transform = function() {};
      };

      Block.prototype.all3 = function() {
        this.all = [[1, gridMid], [1, gridMid - 1], [0, gridMid], [1, gridMid + 1]];
        this.antenna = 1;
        this.detect = function() {
          var flag, mid,
            _this = this;
          mid = this.all[0];
          flag = false;
          switch (this.form) {
            case 1:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1] + 1], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 2:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0], mid[1] - 1], [mid[0] - 1, mid[1] + 1], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 3:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1]], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 4:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1] + 1], [mid[0], mid[1] + 1], [mid[0] + 1, mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
          }
          return flag;
        };
        return this.transform = function() {
          var _this = this;
          if (!this.detect()) {
            switch (this.form) {
              case 1:
                return (function() {
                  var co, k, key, min, _ref;
                  _this.all[_this.antenna][0] += 1;
                  _this.all[_this.antenna][1] += 1;
                  _this.form = 2;
                  min = gridh;
                  _ref = _this.all;
                  for (k in _ref) {
                    co = _ref[k];
                    if (co[0] < min) {
                      min = co[0];
                      key = k;
                    }
                  }
                  return _this.antenna = key;
                })();
              case 2:
                return (function() {
                  var co, k, key, max, _ref;
                  _this.all[_this.antenna][0] += 1;
                  _this.all[_this.antenna][1] -= 1;
                  _this.form = 3;
                  max = -1;
                  _ref = _this.all;
                  for (k in _ref) {
                    co = _ref[k];
                    if (co[1] > max) {
                      max = co[1];
                      key = k;
                    }
                  }
                  return _this.antenna = key;
                })();
              case 3:
                return (function() {
                  var co, k, key, max, _ref;
                  console.log("akb48");
                  _this.all[_this.antenna][0] -= 1;
                  _this.all[_this.antenna][1] -= 1;
                  _this.form = 4;
                  max = -1;
                  _ref = _this.all;
                  for (k in _ref) {
                    co = _ref[k];
                    if (co[0] > max) {
                      max = co[0];
                      key = k;
                    }
                  }
                  return _this.antenna = key;
                })();
              case 4:
                return (function() {
                  var co, k, key, min, _ref;
                  _this.all[_this.antenna][0] -= 1;
                  _this.all[_this.antenna][1] += 1;
                  _this.form = 1;
                  min = gridw;
                  _ref = _this.all;
                  for (k in _ref) {
                    co = _ref[k];
                    if (co[1] < min) {
                      min = co[1];
                      key = k;
                    }
                  }
                  return _this.antenna = key;
                })();
            }
          }
        };
      };

      Block.prototype.right3 = function() {
        this.all = [[1, gridMid], [0, gridMid], [0, gridMid + 1], [2, gridMid]];
        this.top = this.all[1];
        this.mid = this.all[0];
        this.bottom = this.all[3];
        this.antenna = this.all[2];
        this.detect = function() {
          var flag, mid,
            _this = this;
          mid = this.all[0];
          flag = false;
          switch (this.form) {
            case 1:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0], mid[1] - 1], [mid[0], mid[1] + 1], [mid[0] + 1, mid[1] - 1], [mid[0] + 1, mid[1] + 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 2:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1]], [mid[0] + 1, mid[1] - 1], [mid[0] + 1, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 3:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1] + 1], [mid[0], mid[1] - 1], [mid[0], mid[1] + 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 4:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1]], [mid[0] - 1, mid[1] + 1], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
          }
          return flag;
        };
        return this.transform = function() {
          var _this = this;
          if (!this.detect()) {
            switch (this.form) {
              case 1:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[0] += 2;
                  _this.top[0] += 1;
                  _this.top[1] += 1;
                  _this.bottom[0] -= 1;
                  _this.bottom[1] -= 1;
                  _this.form = 2;
                  _this.right = _this.top;
                  _this.left = _this.bottom;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[0] > _this.antenna[0]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 2:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[1] -= 2;
                  _this.right[0] += 1;
                  _this.right[1] -= 1;
                  _this.left[0] -= 1;
                  _this.left[1] += 1;
                  _this.form = 3;
                  _this.top = _this.left;
                  _this.bottom = _this.right;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[1] < _this.antenna[1]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 3:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[0] -= 2;
                  _this.top[0] += 1;
                  _this.top[1] += 1;
                  _this.bottom[0] -= 1;
                  _this.bottom[1] -= 1;
                  _this.form = 4;
                  _this.right = _this.top;
                  _this.left = _this.bottom;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[0] < _this.antenna[0]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 4:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[1] += 2;
                  _this.right[0] += 1;
                  _this.right[1] -= 1;
                  _this.left[0] -= 1;
                  _this.left[1] += 1;
                  _this.form = 1;
                  _this.top = _this.left;
                  _this.bottom = _this.right;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[1] > _this.antenna[1]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
            }
          }
        };
      };

      Block.prototype.left3 = function() {
        this.all = [[1, gridMid], [0, gridMid], [0, gridMid - 1], [2, gridMid]];
        this.top = this.all[1];
        this.mid = this.all[0];
        this.bottom = this.all[3];
        this.antenna = this.all[2];
        this.detect = function() {
          var flag, mid,
            _this = this;
          mid = this.all[0];
          flag = false;
          switch (this.form) {
            case 1:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] + 1], [mid[0], mid[1] - 1], [mid[0], mid[1] + 1], [mid[0] + 1, mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 2:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1]], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 3:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] + 1], [mid[0], mid[1] - 1], [mid[0], mid[1] + 1], [mid[0] + 1, mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 4:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1]], [mid[0] + 1, mid[1] + 1], [mid[0] + 1, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
          }
          return flag;
        };
        return this.transform = function() {
          var _this = this;
          if (!this.detect()) {
            switch (this.form) {
              case 1:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[1] += 2;
                  _this.top[0] += 1;
                  _this.top[1] += 1;
                  _this.bottom[0] -= 1;
                  _this.bottom[1] -= 1;
                  _this.form = 2;
                  _this.right = _this.top;
                  _this.left = _this.bottom;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[0] < _this.antenna[0]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 2:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[0] += 2;
                  _this.right[0] += 1;
                  _this.right[1] -= 1;
                  _this.left[0] -= 1;
                  _this.left[1] += 1;
                  _this.form = 3;
                  _this.top = _this.left;
                  _this.bottom = _this.right;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[1] > _this.antenna[1]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 3:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[1] -= 2;
                  _this.top[0] += 1;
                  _this.top[1] += 1;
                  _this.bottom[0] -= 1;
                  _this.bottom[1] -= 1;
                  _this.form = 4;
                  _this.right = _this.top;
                  _this.left = _this.bottom;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[0] > _this.antenna[0]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
              case 4:
                return (function() {
                  var co, _i, _len, _ref, _results;
                  _this.antenna[0] -= 2;
                  _this.right[0] += 1;
                  _this.right[1] -= 1;
                  _this.left[0] -= 1;
                  _this.left[1] += 1;
                  _this.form = 1;
                  _this.top = _this.left;
                  _this.bottom = _this.right;
                  _ref = _this.all;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    co = _ref[_i];
                    if (co[1] < _this.antenna[1]) {
                      _results.push(_this.antenna = co);
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                })();
            }
          }
        };
      };

      Block.prototype.right2 = function() {
        this.all = [[1, gridMid], [0, gridMid], [0, gridMid - 1], [1, gridMid + 1]];
        this.antenna_1 = this.all[2];
        this.antenna_2 = this.all[1];
        this.detect = function() {
          var flag, mid,
            _this = this;
          mid = this.antenna_2;
          flag = false;
          switch (this.form) {
            case 1:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 1, mid[1] + 1], [mid[0] - 1, mid[1] - 1], [mid[0] - 1, mid[1]], [mid[0], mid[1] + 1], [mid[0] + 2, mid[1]], [mid[0] + 2, mid[1] + 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 2:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 2, mid[1] - 1], [mid[0] - 2, mid[1]], [mid[0], mid[1] + 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
          }
          return flag;
        };
        return this.transform = function() {
          var _this = this;
          if (!this.detect()) {
            switch (this.form) {
              case 1:
                return (function() {
                  _this.antenna_1[1] += 2;
                  _this.antenna_2[0] += 2;
                  return _this.form = 2;
                })();
              case 2:
                return (function() {
                  _this.antenna_1[1] -= 2;
                  _this.antenna_2[0] -= 2;
                  return _this.form = 1;
                })();
            }
          }
        };
      };

      Block.prototype.left2 = function() {
        this.all = [[1, gridMid], [0, gridMid], [0, gridMid + 1], [1, gridMid - 1]];
        this.antenna_1 = this.all[2];
        this.antenna_2 = this.all[1];
        this.detect = function() {
          var flag, mid,
            _this = this;
          mid = this.antenna_2;
          flag = false;
          switch (this.form) {
            case 1:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0], mid[1] - 1], [mid[0] + 2, mid[1] - 1], [mid[0] + 2, mid[1]]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
            case 2:
              (function() {
                var b, blocks, _i, _len, _results;
                blocks = [[mid[0] - 2, mid[1] + 1], [mid[0] - 2, mid[1]], [mid[0], mid[1] - 1]];
                _results = [];
                for (_i = 0, _len = blocks.length; _i < _len; _i++) {
                  b = blocks[_i];
                  if (Tile.isHit(b[0], b[1])) {
                    _results.push(flag = true);
                  } else {
                    _results.push(void 0);
                  }
                }
                return _results;
              })();
              break;
          }
          return flag;
        };
        return this.transform = function() {
          var _this = this;
          if (!this.detect()) {
            switch (this.form) {
              case 1:
                return (function() {
                  _this.antenna_1[1] -= 2;
                  _this.antenna_2[0] += 2;
                  return _this.form = 2;
                })();
              case 2:
                return (function() {
                  _this.antenna_1[1] += 2;
                  _this.antenna_2[0] -= 2;
                  return _this.form = 1;
                })();
            }
          }
        };
      };

      Block.prototype.initBlock = function() {
        switch (this.type) {
          case "straight4":
            return this.straight4();
          case "all2":
            return this.all2();
          case "all3":
            return this.all3();
          case "right3":
            return this.right3();
          case "left3":
            return this.left3();
          case "right2":
            return this.right2();
          case "left2":
            return this.left2();
        }
      };

      function Block(num) {
        this.form = 1;
        if (num != null) {
          this.type = this.constructor.BlockType[num];
        } else {
          this.type = this.constructor.randomBlock();
        }
        this.initBlock();
      }

      Block.prototype.draw = function(colour) {
        var co, ctx, _i, _len, _ref, _results;
        if (colour == null) {
          colour = "rgb(0,255,0)";
        }
        ctx = Tile.canvas.ctx();
        ctx.fillStyle = colour;
        if (this.all) {
          _ref = this.all;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            co = _ref[_i];
            _results.push(ctx.fillRect(Tile.tile[co[0]][co[1]].x, Tile.tile[co[0]][co[1]].y, Tile.tilew, Tile.tileh));
          }
          return _results;
        }
      };

      Block.prototype.move = function(direct) {
        var all, co, flag, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results,
          _this = this;
        this.draw("rgb(255,255,255)");
        flag = true;
        all = (function() {
          var _i, _len, _ref, _results;
          _ref = this.all;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            co = _ref[_i];
            _results.push(co.toString());
          }
          return _results;
        }).call(this);
        _ref = this.all;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          co = _ref[_i];
          switch (direct) {
            case KEY.DOWN:
              (function() {
                var _ref1;
                if (Tile.isHit(co[0] + 1, co[1]) && (_ref1 = [co[0] + 1, co[1]].toString(), __indexOf.call(all, _ref1) < 0)) {
                  return flag = false;
                }
              })();
              break;
            case KEY.LEFT:
              (function() {
                var _ref1;
                if (Tile.isHit(co[0], co[1] - 1) && (_ref1 = [co[0], co[1] - 1].toString(), __indexOf.call(all, _ref1) < 0)) {
                  return flag = false;
                }
              })();
              break;
            case KEY.RIGHT:
              (function() {
                var _ref1;
                if (Tile.isHit(co[0], co[1] + 1) && (_ref1 = [co[0], co[1] + 1].toString(), __indexOf.call(all, _ref1) < 0)) {
                  return flag = false;
                }
              })();
              break;
          }
        }
        if (flag === false && direct === KEY.DOWN) {
          this.done = true;
          this.step = clearInterval(this.step);
        }
        if (flag || direct === KEY.UP) {
          _ref1 = this.all;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            co = _ref1[_j];
            Tile.tile[co[0]][co[1]].fill = false;
            switch (direct) {
              case KEY.DOWN:
                co[0] += 1;
                break;
              case KEY.LEFT:
                co[1] -= 1;
                break;
              case KEY.RIGHT:
                co[1] += 1;
                break;
            }
          }
          if (direct === KEY.UP) {
            this.transform();
          }
          _ref2 = this.all;
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            co = _ref2[_k];
            _results.push(Tile.tile[co[0]][co[1]].fill = true);
          }
          return _results;
        }
      };

      return Block;

    })();
    Tile.initTile();
    window.Tile = Tile;
    return window.Block = Block;
  });

  $(document).ready(function() {
    var b;
    b = null;
    setInterval(function() {
      if (!(b != null ? b.step : void 0)) {
        b = new Block;
        b.draw();
        return b.step = setInterval(function() {
          b.move(KEY.DOWN);
          b.draw();
          if (b.done) {
            return Tile.refresh();
          }
        }, 500);
      }
    }, 200);
    return $(document).keydown(function(e) {
      console.log(e.which);
      b.move(e.which);
      return b.draw();
    });
  });

}).call(this);