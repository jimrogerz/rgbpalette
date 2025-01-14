#define PI 3.1415926538

precision mediump float;
varying lowp vec4 vPosition;
uniform vec3 bgColor;

float getAngle(float x, float y) {
  if (x > 0.0) {
    if (y >= 0.0) {
        return atan(y / x);
    }
    return atan(x / -y) + 1.5 * PI;
  }
  if (x < 0.0) {
      if (y >= 0.0) {
        return PI - atan(y / -x);
      }
      return atan(y / x) + PI;
  }
  return 0.0;
}

float minComponent(vec3 color) {
  return min(color.r, min(color.g, color.b));
}

float maxComponent(vec3 color) {
  return max(color.r, max(color.g, color.b));
}

vec3 normalize2(vec3 color) {
  if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
    return vec3(1.0, 1.0, 1.0);
  }
  float scale = 1.0 / maxComponent(color);
  return color * scale;
}

float lerp(float a, float b, float s) {
  return a + (b - a) * s;
}

vec3 saturate(vec3 color, float saturation) {
    return vec3(
      lerp(0.5, color.r, saturation),
      lerp(0.5, color.g, saturation),
      lerp(0.5, color.b, saturation)
    );
}

// angle: 0-360 with 0 pointing right
// saturation: 0=white, 1=full culor
vec3 rgbWheel(float angle, float saturation) {
    angle -= 90.0;
    if (angle < 0.0) {
        angle += 360.0;
    }

    float r = 0.0;
    float g = 0.0;
    float b = 0.0;
    if (angle < 60.0) {
        r = 1.0;
        b = angle / 60.0;
    } else if (angle < 120.0) {
        r = (120.0 - angle) / 60.0;
        b = 1.0;
    } else if (angle < 180.0) {
        b = 1.0;
        g = 1.0 - (180.0 - angle) / 60.0;
    } else if(angle < 240.0) {
        g = 1.0;
        b = (240.0 - angle) / 60.0;
    } else if (angle < 300.0) {
        g = 1.0;
        r = 1.0 - (300.0 - angle) / 60.0;
    } else {
        r = 1.0;
        g = (360.0 - angle) / 60.0;
    }
   
    return saturate(vec3(r, g, b), saturation);
}

vec4 borderColor(vec3 rgb, float m) {
  float max = .01;
  m /= max;
  m = min(m, 1.0);
  return vec4(mix(rgb, bgColor, m), 1.0);
}

void main(void) {
    float angle = 180. * getAngle(vPosition.x, vPosition.y) / PI;
    float d = sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y);
    vec3 rgb = rgbWheel(angle, d);
    if (d > .99) {
      gl_FragColor = borderColor(rgb, d - .99);
      return;
    }
    gl_FragColor = vec4(rgb, 1.0);
}
