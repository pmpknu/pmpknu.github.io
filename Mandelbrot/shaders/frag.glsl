precision mediump float;

uniform float iterations;
uniform float mouseCoordX;
uniform float mouseCoordY;
uniform float mouseWheel;

void main(void)
{
  vec2 z, z1, z0 = vec2((gl_FragCoord.x - mouseCoordX) / mouseWheel, (gl_FragCoord.y + mouseCoordY - 500.0) / mouseWheel);
  int n, a = int(iterations);

  z = z0;

  for (int i = 0; i < 8192; i++)
  {
    if (i > a)
      break;

    z1.x = z.x * z.x - z.y * z.y + z0.x;
    z1.y = 2.0 * z.x * z.y + z0.y;
    z = z1;

    if (z.x * z.x + z.y * z.y > 4.0)
      n = i; 
  }
  
  float col = float(n) / 4.0;

  gl_FragColor = vec4(col / 2.0, col / 4.0, col / 8.0, 1.0);
  //gl_FragColor = vec4(mouseCoordX / 501.0, mouseCoordY / 501.0, col / 8.0, 1.0);
}