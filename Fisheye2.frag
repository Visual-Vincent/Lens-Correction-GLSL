/*
    Credits:
      "Fisheye / antifisheye" by SanchYESS (https://www.shadertoy.com/user/SanchYESS)
       is licensed under CC-BY-NC-SA 3.0 (https://creativecommons.org/licenses/by-nc-sa/3.0/)

      Originally from https://www.shadertoy.com/view/4s2GRR

      Slight modifications have been made:
       - Renamed/replaced Shadertoy-specific variables and added boilerplate code
         in order for the shader to be usable in a standard OpenGL environment

       - Changed the 'col' variable from a vec3 to a vec4 to add support for alpha channel
*/

#version 330 core

out vec4 FragColor;

uniform vec2 ViewportSize;  // The viewport size (in pixels, e.g. 1920 x 1080)
uniform sampler2D texture0; // The texture to distort
uniform float Distortion;   // The distortion amount (positive = barrel distortion, negative = pincushion distortion)

void main()
{
    vec2 p = gl_FragCoord.xy / ViewportSize.x;//normalized coords with some cheat
                                                             //(assume 1:1 prop)
    float prop = ViewportSize.x / ViewportSize.y;//screen proroption
    vec2 m = vec2(0.5, 0.5 / prop);//center coords
    vec2 d = p - m;//vector from center to current fragment
    float r = sqrt(dot(d, d)); // distance of pixel from center

    float power = ( 2.0 * 3.141592 / (2.0 * sqrt(dot(m, m))) ) *
                amount;//amount of effect

    float bind;//radius of 1:1 effect
    if (power > 0.0) bind = sqrt(dot(m, m));//stick to corners
    else {if (prop < 1.0) bind = m.x; else bind = m.y;}//stick to borders

    //Weird formulas
    vec2 uv;
    if (power > 0.0)//fisheye
        uv = m + normalize(d) * tan(r * power) * bind / tan( bind * power);
    else if (power < 0.0)//antifisheye
        uv = m + normalize(d) * atan(r * -power * 10.0) * bind / atan(-power * bind * 10.0);
    else uv = p;//no effect for power = 1.0

    vec4 col = texture(tex, vec2(uv.x, -uv.y * prop));//Second part of cheat
                                                      //for round effect, not elliptical
    FragColor = col;
}