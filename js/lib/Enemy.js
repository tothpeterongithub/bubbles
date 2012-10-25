// Generated by CoffeeScript 1.3.3
(function() {
  var Enemy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Enemy = (function(_super) {

    __extends(Enemy, _super);

    function Enemy(radius) {
      var where_to_place_the_bubble, x, x_velocity, y, y_velocity;
      if (radius == null) {
        radius = 10 + Math.random() * 10;
      }
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

  })(CircleMovingInGameObject);

}).call(this);