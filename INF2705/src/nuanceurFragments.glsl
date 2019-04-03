#version 410

uniform sampler2D leLutin;
uniform int texnumero;

in Attribs {
    vec4 couleur;
    vec2 texCoord;
} AttribsIn;

out vec4 FragColor;

void main( void )
{
    // Mettre un test bidon afin que l'optimisation du compilateur n'élimine l'attribut "couleur".
    // Vous ENLEVEREZ cet énoncé inutile!
    if ( AttribsIn.couleur.r + texnumero + texture(leLutin,vec2(0.0)).r < 0.0 ) discard;

    // FragColor = texture( leLutin, gl_PointCoord );
    FragColor = AttribsIn.couleur;

    if(texnumero != 0) {
        vec4 couleur = texture(leLutin, AttribsIn.texCoord);
        FragColor.rgb = mix(AttribsIn.couleur.rgb, couleur.rgb, 0.6);
        FragColor.a = couleur.a;
    }
    if(FragColor.a < 0.1)
        discard;
}
