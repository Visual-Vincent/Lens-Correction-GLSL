/*
    Credits:
      "Barrel/Pincushion Distortion" by parameterized (https://www.shadertoy.com/user/parameterized)
       is licensed under CC-BY-NC-SA 3.0 (https://creativecommons.org/licenses/by-nc-sa/3.0/)

      Originally from https://www.shadertoy.com/view/lttXD4

      Slight modifications have been made (renamed/replaced Shadertoy-specific variables, added boilerplate code)
      in order for the shader to be usable in a standard OpenGL environment
*/

#version 330 core

out vec4 FragColor;

uniform vec2 ViewportSize;  // The viewport size (in pixels, e.g. 1920 x 1080)
uniform sampler2D texture0; // The texture to distort
uniform float Distortion;   // The distortion amount (positive = barrel distortion, negative = pincushion distortion)

void main()
{
    vec2 uv = (gl_FragCoord.xy / ViewportSize.xy) - vec2(0.5);
    float uva = atan(uv.x, uv.y);
    float uvd = sqrt(dot(uv, uv));
    uvd = uvd * (1.0 + Distortion * uvd * uvd);

    return texture(texture0, vec2(0.5) + vec2(sin(uva), cos(uva)) * uvd);
}