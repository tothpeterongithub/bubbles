(function() {
  var BULLET_SHOOTER_RATIO, Bullet, CANVAS_HEIGHT, CANVAS_WIDTH, CircleMovingInGameObject, DEFAULT_FILL_STYLE, DEFAULT_LINE_WIDTH, DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE, DEFAULT_POSITIVE_CIRCLE_JOIN_RATE, DEFAULT_SPEED, DEFAULT_STROKE_STYLE, DEFAULT_USER_SPEED, ENEMIES_PROPABILITY, Enemy, Explosion, InGameObject, MAX_ENEMY_RADIUS, MAX_NUMBER_ENEMIES, MINIMAL_VIABLE_RADIUS, MIN_NEW_ENEMY_SIZE, MovingInGameObject, NEW_ENEMY_PROPABILITY, PROPORTION_MAX_NEW_ENEMY_SIZE, Player, RectangleMovingInGameObject, Rgb, Rgba, SHOOTER_SHOOT_LOSS, bullets, circleCollides, draw, enemies, explosions, game, game_canvas, game_canvas_context, game_element, gc, gcc, ge, keyName, player1, rectCollides, runtime, s_t_a_r_t, start, update;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CANVAS_WIDTH = 850;
  CANVAS_HEIGHT = 600;
  ENEMIES_PROPABILITY = 0.2;
  DEFAULT_SPEED = 0.5;
  DEFAULT_USER_SPEED = 0.1;
  MAX_NUMBER_ENEMIES = 10;
  DEFAULT_LINE_WIDTH = 2;
  DEFAULT_FILL_STYLE = 'black';
  DEFAULT_STROKE_STYLE = 'black';
  DEFAULT_POSITIVE_CIRCLE_JOIN_RATE = 0.5;
  DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE = 1;
  MINIMAL_VIABLE_RADIUS = 1;
  MAX_ENEMY_RADIUS = 750;
  NEW_ENEMY_PROPABILITY = 0.01;
  BULLET_SHOOTER_RATIO = 0.2;
  SHOOTER_SHOOT_LOSS = 0.01;
  PROPORTION_MAX_NEW_ENEMY_SIZE = 2.0;
  MIN_NEW_ENEMY_SIZE = MINIMAL_VIABLE_RADIUS;
  game = this;
  bullets = [];
  enemies = [];
  explosions = [];
  player1 = {};
  s_t_a_r_t = false;
  ge = game_element = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
  gc = game_canvas = game_element.get(0);
  gcc = game_canvas_context = game_canvas.getContext("2d");
  InGameObject = (function() {
    function InGameObject(active, fill_style, stroke_style, line_width) {
      this.active = active != null ? active : true;
      this.fill_style = fill_style != null ? fill_style : DEFAULT_FILL_STYLE;
      this.stroke_style = stroke_style != null ? stroke_style : DEFAULT_STROKE_STYLE;
      this.line_width = line_width != null ? line_width : DEFAULT_LINE_WIDTH;
      gcc.fillStyle = this.fills_style;
      gcc.strokeStyle = this.stroke_style;
      gcc.lineWidth = this.line_width;
    }
    return InGameObject;
  })();
  MovingInGameObject = (function() {
    __extends(MovingInGameObject, InGameObject);
    function MovingInGameObject(x, y, x_velocity, y_velocity, fill_style, stroke_style, line_width, active) {
      this.x = x;
      this.y = y;
      this.x_velocity = x_velocity != null ? x_velocity : 0;
      this.y_velocity = y_velocity != null ? y_velocity : 0;
      this.update = __bind(this.update, this);
      MovingInGameObject.__super__.constructor.call(this, active, fill_style, stroke_style, line_width);
    }
    MovingInGameObject.prototype.update = function() {
      this.x += this.x_velocity;
      return this.y += this.y_velocity;
    };
    return MovingInGameObject;
  })();
  RectangleMovingInGameObject = (function() {
    __extends(RectangleMovingInGameObject, MovingInGameObject);
    function RectangleMovingInGameObject(x, y, width, height, x_velocity, y_velocity, fill_style, stroke_style, line_width, active) {
      this.width = width;
      this.height = height;
      this.draw = __bind(this.draw, this);
      this.testViability = __bind(this.testViability, this);
      this.update = __bind(this.update, this);
      this.addF = __bind(this.addF, this);
      this.setF = __bind(this.setF, this);
      this.getF = __bind(this.getF, this);
      this.inBounds = __bind(this.inBounds, this);
      RectangleMovingInGameObject.__super__.constructor.call(this, x, y, x_velocity, y_velocity, fill_style, stroke_style, line_width, active);
    }
    RectangleMovingInGameObject.prototype.inBounds = function() {
      return this.x >= 0 && this.x <= CANVAS_WIDTH && this.y >= 0 && this.y <= CANVAS_HEIGHT;
    };
    RectangleMovingInGameObject.prototype.getF = function() {
      return this.radius * this.radius * Math.PI;
    };
    RectangleMovingInGameObject.prototype.setF = function(newF) {
      return this.radius = Math.sqrt(newF / Math.PI);
    };
    RectangleMovingInGameObject.prototype.addF = function(plusF) {
      return this.setF(this.getF() + plusF);
    };
    RectangleMovingInGameObject.prototype.update = function() {
      RectangleMovingInGameObject.__super__.update.call(this);
      return this.testViability();
    };
    RectangleMovingInGameObject.prototype.testViability = function() {
      return this.active = this.active && inBounds();
    };
    RectangleMovingInGameObject.prototype.draw = function(fill, stroke) {
      if (fill == null) {
        fill = true;
      }
      if (stroke == null) {
        stroke = false;
      }
      if (fill) {
        gcc.fillStyle = this.fill_style;
        gcc.fillRect(this.x, this.y, this.width, this.height);
      }
      if (stroke) {
        gcc.strokeStyle = this.stroke_style;
        return gcc.strokeRect(this.x, this.y, this.width, this.height);
      }
    };
    return RectangleMovingInGameObject;
  })();
  CircleMovingInGameObject = (function() {
    __extends(CircleMovingInGameObject, RectangleMovingInGameObject);
    function CircleMovingInGameObject(cx, cy, radius, x_velocity, y_velocity, fill_style, stroke_style, active) {
      this.cx = cx;
      this.cy = cy;
      this.radius = radius;
      this.explode = __bind(this.explode, this);
      this.join = __bind(this.join, this);
      this.inBounds = __bind(this.inBounds, this);
      this.draw = __bind(this.draw, this);
      this.testViability = __bind(this.testViability, this);
      this.update = __bind(this.update, this);
      this.setCircleBox = __bind(this.setCircleBox, this);
      this.setCircleBox();
      CircleMovingInGameObject.__super__.constructor.call(this, this.x, this.y, this.width, this.height, x_velocity, y_velocity, fill_style, stroke_style, active);
    }
    CircleMovingInGameObject.prototype.setCircleBox = function() {
      this.width = this.height = this.radius * 2;
      this.x = this.cx - this.radius;
      return this.y = this.cy - this.radius;
    };
    CircleMovingInGameObject.prototype.update = function() {
      this.cx += this.x_velocity;
      this.cy += this.y_velocity;
      this.setCircleBox();
      if (this.inBounds() === false) {
        if (this.cx < 0) {
          this.cx = CANVAS_WIDTH + (this.cx * -1);
        } else if (this.cx > CANVAS_WIDTH) {
          this.cx = (this.cx - CANVAS_WIDTH) * -1;
        }
        if (this.cy < 0) {
          this.cy = CANVAS_HEIGHT + (this.cy * -1);
        } else if (this.cy > CANVAS_HEIGHT) {
          this.cy = (this.cy - CANVAS_HEIGHT) * -1;
        }
      }
      CircleMovingInGameObject.__super__.update.call(this);
      return this.testViability();
    };
    CircleMovingInGameObject.prototype.testViability = function() {
      return this.active = this.active && this.radius > MINIMAL_VIABLE_RADIUS;
    };
    CircleMovingInGameObject.prototype.draw = function(fill, stroke, drawbox) {
      var _ref;
      if (fill == null) {
        fill = true;
      }
      if (stroke == null) {
        stroke = false;
      }
      if (drawbox == null) {
        drawbox = false;
      }
      if (drawbox) {
        CircleMovingInGameObject.__super__.draw.call(this, false, true);
      }
      if (fill) {
        gcc.fillStyle = (_ref = this.fill_style) != null ? _ref.toString() : void 0;
        gcc.fillCircle(this.cx, this.cy, this.radius);
      }
      if (stroke) {
        gcc.strokeStyle = this.stroke_style;
        return gcc.strokeCircle(this.cx, this.cy, this.radius);
      }
    };
    CircleMovingInGameObject.prototype.inBounds = function() {
      return this.cx > (this.radius * -1) && this.cx < (CANVAS_WIDTH + this.radius) && this.cy > (this.radius * -1) && this.cy < (CANVAS_HEIGHT + this.radius);
    };
    CircleMovingInGameObject.prototype.join = function(another_circle) {
      var looser, newLooserF, oldLooserF, winner;
      if (!this.active) {
        return false;
      }
      if (!another_circle.active) {
        return false;
      }
      if (this.radius < MINIMAL_VIABLE_RADIUS) {
        return false;
      }
      if (another_circle.radius < MINIMAL_VIABLE_RADIUS) {
        return false;
      }
      winner = false;
      looser = false;
      if (this.radius > another_circle.radius) {
        winner = this;
        looser = another_circle;
      } else if (this.radius < another_circle.radius) {
        winner = another_circle;
        looser = this;
      } else {
        if (Math.random() > 0.5) {
          this.explode();
        } else {
          another_circle.explode();
        }
      }
      if (winner && looser) {
        oldLooserF = looser.getF();
        looser.radius = looser.radius - DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE;
        newLooserF = looser.getF();
        winner.addF(oldLooserF - newLooserF);
      }
      return this.testViability();
    };
    CircleMovingInGameObject.prototype.explode = function() {
      this.active = false;
      return explosions.push(new Explosion(this));
    };
    return CircleMovingInGameObject;
  })();
  Player = (function() {
    __extends(Player, CircleMovingInGameObject);
    function Player(x, y, radius) {
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      this.gunpoint = __bind(this.gunpoint, this);
      this.shoot = __bind(this.shoot, this);      Player.__super__.constructor.call(this, x, y, radius, 0, 0, new Rgba(255, 0, 0, 0.9), 'black');
      this.last_bullet_shot = 0;
      this.age = 0;
    }
    Player.prototype.shoot = function() {
      var x, y, _ref;
      _ref = this.gunpoint(), x = _ref[0], y = _ref[1];
      if (this.last_bullet_shot + 10 < this.age) {
        bullets.push(new Bullet(x, y, this.radius * BULLET_SHOOTER_RATIO, this.x_velocity * 2, this.y_velocity * 2));
        this.last_bullet_shot = this.age;
      }
      return this.radius = this.radius * (1 - SHOOTER_SHOOT_LOSS);
    };
    Player.prototype.gunpoint = function() {
      return [this.x + this.width / 2, this.y + this.height / 2];
    };
    Player.prototype.update = function() {
      this.age++;
      if (keydown.left) {
        this.x_velocity = this.x_velocity - DEFAULT_USER_SPEED;
      }
      if (keydown.right) {
        this.x_velocity = this.x_velocity + DEFAULT_USER_SPEED;
      }
      if (keydown.up) {
        this.y_velocity = this.y_velocity - DEFAULT_USER_SPEED;
      }
      if (keydown.down) {
        this.y_velocity = this.y_velocity + DEFAULT_USER_SPEED;
      }
      this.setCircleBox();
      if (keydown.space) {
        this.shoot();
      }
      return Player.__super__.update.call(this);
    };
    Player.prototype.draw = function() {
      return Player.__super__.draw.call(this, true, true);
    };
    return Player;
  })();
  Explosion = (function() {
    __extends(Explosion, CircleMovingInGameObject);
    function Explosion(ex_circle) {
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);      Explosion.__super__.constructor.call(this, ex_circle.cx, ex_circle.cy, ex_circle.radius, 0, 0, ex_circle.fill_style, ex_circle.stroke_style);
    }
    Explosion.prototype.update = function() {
      if (this.fill_style.a) {
        this.fill_style.a = this.fill_style.a - 0.05;
        if (this.fill_style.a <= 0) {
          this.active = false;
        }
      }
      return this.radius = this.radius + 10;
    };
    Explosion.prototype.draw = function() {
      return Explosion.__super__.draw.call(this, true, true);
    };
    return Explosion;
  })();
  Bullet = (function() {
    __extends(Bullet, CircleMovingInGameObject);
    function Bullet(x, y, radius, x_velocity, y_velocity) {
      if (radius == null) {
        radius = 3;
      }
      this.draw = __bind(this.draw, this);
      Bullet.__super__.constructor.call(this, x, y, radius, x_velocity, y_velocity, 'yellow', 'black');
    }
    Bullet.prototype.draw = function() {
      return Bullet.__super__.draw.call(this, true, true);
    };
    return Bullet;
  })();
  Enemy = (function() {
    __extends(Enemy, CircleMovingInGameObject);
    function Enemy(radius) {
      var where_to_place_the_bubble, x, x_velocity, y, y_velocity;
      if (radius == null) {
        radius = 10 + Math.random() * 10;
      }
      this.join = __bind(this.join, this);
      this.draw = __bind(this.draw, this);
      this.update = __bind(this.update, this);
      if (radius > MAX_ENEMY_RADIUS) {
        radius = MAX_ENEMY_RADIUS;
      }
      where_to_place_the_bubble = Math.random();
      if (where_to_place_the_bubble < 0.25) {
        y = -radius;
        x = Math.random() * CANVAS_WIDTH;
        y_velocity = DEFAULT_SPEED;
        x_velocity = (DEFAULT_SPEED * -1) + Math.random() * (1 + DEFAULT_SPEED);
      } else if (where_to_place_the_bubble < 0.50) {
        y = CANVAS_HEIGHT + radius;
        x = Math.random() * CANVAS_WIDTH;
        y_velocity = DEFAULT_SPEED * -1;
        x_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      } else if (where_to_place_the_bubble < 0.75) {
        y = Math.random() * CANVAS_HEIGHT;
        x = -radius;
        x_velocity = 1;
        y_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      } else {
        y = Math.random() * CANVAS_HEIGHT;
        x = CANVAS_WIDTH + radius;
        x_velocity = DEFAULT_SPEED * -1;
        y_velocity = (DEFAULT_SPEED * -1) * Math.random() * (1 + DEFAULT_SPEED);
      }
      this.age = 0;
      Enemy.__super__.constructor.call(this, x, y, radius, x_velocity, y_velocity, new Rgba(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 0.7), 'rgb(0,0,255)');
    }
    Enemy.prototype.update = function() {
      Enemy.__super__.update.call(this);
      if (this.radius > player1.radius) {
        this.stroke_style = 'black';
      }
      if (this.radius >= MAX_ENEMY_RADIUS) {
        this.stroke_style = 'darkred';
      }
      if (this.radius < player1.radius) {
        return this.stroke_style = 'blue';
      }
    };
    Enemy.prototype.draw = function() {
      return Enemy.__super__.draw.call(this, true, true);
    };
    Enemy.prototype.join = function(another_circle) {
      Enemy.__super__.join.call(this, another_circle);
      if (this.radius > MAX_ENEMY_RADIUS) {
        return this.radius = MAX_ENEMY_RADIUS;
      }
    };
    return Enemy;
  })();
  runtime = function(time) {
    update();
    draw();
    return window.webkitRequestAnimationFrame(runtime, gc);
  };
  update = function() {
    var bullet, enemy, _fn, _fn2, _i, _j, _k, _len, _len2, _len3;
    _fn = function(enemy) {
      var enemy2, _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
        enemy2 = enemies[_j];
        if ((enemy2 !== enemy) && circleCollides(enemy, enemy2) && (enemy2.active && enemy.active)) {
          _results.push((function(enemy) {
            return enemy.join(enemy2);
          })(enemy));
        }
      }
      return _results;
    };
    for (_i = 0, _len = enemies.length; _i < _len; _i++) {
      enemy = enemies[_i];
      _fn(enemy);
    }
    for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
      enemy = enemies[_j];
      if (circleCollides(enemy, player1)) {
        (function(enemy) {
          return player1.join(enemy);
        })(enemy);
      }
    }
    _fn2 = function(bullet) {
      var enemy, _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = enemies.length; _l < _len4; _l++) {
        enemy = enemies[_l];
        if (circleCollides(bullet, enemy)) {
          _results.push((enemy.explode(), bullet.active = false));
        }
      }
      return _results;
    };
    for (_k = 0, _len3 = bullets.length; _k < _len3; _k++) {
      bullet = bullets[_k];
      _fn2(bullet);
    }
    enemies = (function() {
      var enemy, _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = enemies.length; _l < _len4; _l++) {
        enemy = enemies[_l];
        if (enemy.active) {
          _results.push((enemy.update(), enemy));
        }
      }
      return _results;
    })();
    explosions = (function() {
      var explosion, _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = explosions.length; _l < _len4; _l++) {
        explosion = explosions[_l];
        if (explosion.active) {
          _results.push((explosion.update(), explosion));
        }
      }
      return _results;
    })();
    bullets = (function() {
      var bullet, _l, _len4, _results;
      _results = [];
      for (_l = 0, _len4 = bullets.length; _l < _len4; _l++) {
        bullet = bullets[_l];
        if (bullet.active) {
          _results.push((bullet.update(), bullet));
        }
      }
      return _results;
    })();
    player1.update();
    if (enemies.length < MAX_NUMBER_ENEMIES) {
      if (Math.random() < NEW_ENEMY_PROPABILITY) {
        enemies.push(new Enemy(MIN_NEW_ENEMY_SIZE + Math.random() * (player1.radius * PROPORTION_MAX_NEW_ENEMY_SIZE)));
      }
    }
    if (player1.active === false) {
      start();
    }
    if (player1.radius * 1.2 > CANVAS_HEIGHT) {
      start();
    }
  };
  draw = function() {
    var bullet, enemy, explosion, _i, _j, _k, _len, _len2, _len3, _results;
    gcc.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player1.draw();
    for (_i = 0, _len = bullets.length; _i < _len; _i++) {
      bullet = bullets[_i];
      bullet.draw();
    }
    for (_j = 0, _len2 = enemies.length; _j < _len2; _j++) {
      enemy = enemies[_j];
      enemy.draw();
    }
    _results = [];
    for (_k = 0, _len3 = explosions.length; _k < _len3; _k++) {
      explosion = explosions[_k];
      _results.push(explosion.draw());
    }
    return _results;
  };
  rectCollides = function(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  };
  circleCollides = function(c1, c2) {
    var a, b, c;
    if (rectCollides(c1, c2)) {
      a = c2.cx - c1.cx;
      b = c2.cy - c1.cy;
      c = Math.sqrt(a * a + b * b);
      if ((c - c1.radius - c2.radius) < 0) {
        return true;
      }
    }
    return false;
  };
  window.keydown = {};
  keyName = function(event) {
    return $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
  };
  $(document).bind("keydown", (function(event) {
    return keydown[keyName(event)] = true;
  }));
  $(document).bind("keyup", (function(event) {
    return keydown[keyName(event)] = false;
  }));
  Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };
  CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    return this.fill();
  };
  CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
    return this.stroke();
  };
  Rgb = (function() {
    function Rgb(r, g, b) {
      this.r = r != null ? r : 0;
      this.g = g != null ? g : 0;
      this.b = b != null ? b : 0;
    }
    Rgb.prototype.toString = function() {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ')';
    };
    return Rgb;
  })();
  Rgba = (function() {
    __extends(Rgba, Rgb);
    function Rgba(r, g, b, a) {
      if (r == null) {
        r = 0;
      }
      if (g == null) {
        g = 0;
      }
      if (b == null) {
        b = 0;
      }
      this.a = a != null ? a : 1;
      Rgba.__super__.constructor.call(this, r, g, b);
    }
    Rgba.prototype.toString = function() {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    };
    return Rgba;
  })();
  $('#gamearea').append(game_element);
  console.log(player1);
  start = function() {
    enemies = [];
    bullets = [];
    explosions = [];
    return player1 = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20);
  };
  start();
  runtime();
}).call(this);