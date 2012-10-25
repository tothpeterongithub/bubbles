// Generated by CoffeeScript 1.3.3
(function() {
  var BULLET_SHOOTER_RATIO, CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_FILL_STYLE, DEFAULT_LINE_WIDTH, DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE, DEFAULT_POSITIVE_CIRCLE_JOIN_RATE, DEFAULT_SPEED, DEFAULT_STROKE_STYLE, DEFAULT_USER_ACCELERATION, ENEMIES_PROPABILITY, MAX_ENEMY_RADIUS, MAX_NUMBER_ENEMIES, MAX_USER_SPEED, MINIMAL_VIABLE_RADIUS, MIN_NEW_ENEMY_SIZE, NEW_ENEMY_PROPABILITY, PROPORTION_MAX_NEW_ENEMY_SIZE, SHOOTER_SHOOT_LOSS, bullets, enemies, explosions, game, game_canvas, game_canvas_context, game_element, gc, gcc, ge, player1, s_t_a_r_t;

  CANVAS_WIDTH = 850;

  CANVAS_HEIGHT = 600;

  ENEMIES_PROPABILITY = 0.5;

  DEFAULT_SPEED = 0.5;

  DEFAULT_USER_ACCELERATION = 0.1;

  MAX_USER_SPEED = 4;

  MAX_NUMBER_ENEMIES = 1000;

  DEFAULT_LINE_WIDTH = 2;

  DEFAULT_FILL_STYLE = 'black';

  DEFAULT_STROKE_STYLE = 'black';

  DEFAULT_POSITIVE_CIRCLE_JOIN_RATE = 0.5;

  DEFAULT_NEGATIVE_CIRCLE_JOIN_RATE = 1;

  MINIMAL_VIABLE_RADIUS = 1;

  MAX_ENEMY_RADIUS = 450;

  NEW_ENEMY_PROPABILITY = 0.05;

  BULLET_SHOOTER_RATIO = 0.2;

  SHOOTER_SHOOT_LOSS = 0.01;

  PROPORTION_MAX_NEW_ENEMY_SIZE = 12.0;

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

}).call(this);