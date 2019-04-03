#version 410
uniform mat4 matrProj;
uniform int texnumero;

layout(points) in;
layout(triangle_strip, max_vertices = 4) out;
in Attribs {
    vec4 couleur;
    float tempsDeVieRestant;
    float sens; // du vol
} AttribsIn[];

out Attribs {
    vec4 couleur;
    vec2 texCoord;
} AttribsOut;

const int POINTSIZE = 100;
const float NBIMAGES = 16.0;
const int ETINCELLE = 1;
const int OISEAU = 2;
const int BONHOMME = 3;
const int TAUX_ROT = 6;
const int BATTEMENT = 18;

void main()
{
    // associer les vertex à l'image
    vec2 coins[4];
    coins[0] = vec2(-0.5,  0.5);
    coins[1] = vec2(-0.5, -0.5);
    coins[2] = vec2( 0.5,  0.5);
    coins[3] = vec2( 0.5, -0.5);

    // assigner la taille des points (en pixels)
    gl_PointSize = gl_in[0].gl_PointSize;

    // assigner la position du point
    // gl_Position = gl_in[0].gl_Position;
    
    // frequénce de roation (rad/s)
    float angleRotation = TAUX_ROT * AttribsIn[0].tempsDeVieRestant * AttribsIn[0].sens;

    // matrice de rotation 
    mat2 textureRotation = mat2(cos(angleRotation), -sin(angleRotation), sin(angleRotation), cos(angleRotation));

    for( int i = 0; i < 4; i++) {
        // division par 50 pour la grosseur
        float fact =  gl_PointSize / POINTSIZE ;
        vec2 decalage = coins[i];
        vec4 pos = vec4(gl_in[0].gl_Position.xy + fact * decalage, gl_in[0].gl_Position.zw);

        // assigner la couleur courante
        AttribsOut.couleur = AttribsIn[0].couleur;

    if (texnumero == ETINCELLE) {
        // on utilise coins[] pour définir les coordonnées de texture avec la rotation
        AttribsOut.texCoord = textureRotation * coins[i] + vec2(0.5, 0.5);
    } else if (texnumero == OISEAU || texnumero == BONHOMME) {
        // se mettre au centre de l'image
        AttribsOut.texCoord = coins[i] + vec2(0.5, 0.5);
        // on divise par le nombre d'oiseau ou bonhomme (16)
        AttribsOut.texCoord.x /= NBIMAGES;
        // fréquence de battements des ailes
        AttribsOut.texCoord.x += int(BATTEMENT*AttribsIn[0].tempsDeVieRestant)/NBIMAGES;
        // on donne un sens pour chaque bord
        AttribsOut.texCoord.x *= AttribsIn[0].sens;
    }
    
     else {
        AttribsOut.texCoord = coins[i] + vec2(0.5, 0.5);
    }
    // on termine la transformation debutee dans le nuanceur de sommets
    gl_Position = matrProj * pos;
     EmitVertex();
   }

}
