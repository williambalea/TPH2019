#version 410

// Définition des paramètres des sources de lumière
layout (std140) uniform LightSourceParameters
{
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 position[3];      // dans le repère du monde
    float constantAttenuation;
    float linearAttenuation;
    float quadraticAttenuation;
} LightSource;

// Définition des paramètres des matériaux
layout (std140) uniform MaterialParameters
{
    vec4 emission;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    float shininess;
} FrontMaterial;

// Définition des paramètres globaux du modèle de lumière
layout (std140) uniform LightModelParameters
{
    vec4 ambient;       // couleur ambiante
    bool localViewer;   // observateur local ou à l'infini?
    bool twoSide;       // éclairage sur les deux côtés ou un seul?
} LightModel;

layout (std140) uniform varsUnif
{
    // partie 1: illumination
    int typeIllumination;     // 0:Gouraud, 1:Phong
    bool utiliseBlinn;        // indique si on veut utiliser modèle spéculaire de Blinn ou Phong
    bool afficheNormales;     // indique si on utilise les normales comme couleurs (utile pour le débogage)
    // partie 2: texture
    int numTexCoul;           // numéro de la texture de couleurs appliquée
    int numTexNorm;           // numéro de la texture de normales appliquée
    bool utiliseCouleur;      // doit-on utiliser la couleur de base de l'objet en plus de celle de la texture?
    int afficheTexelFonce;    // un texel foncé doit-il être affiché 0:normalement, 1:mi-coloré, 2:transparent?
};

const int PHONG = 1;
const int GOURAUD = 0;

uniform mat4 matrModel;
uniform mat4 matrVisu;
uniform mat4 matrProj;
uniform mat3 matrNormale;

/////////////////////////////////////////////////////////////////

layout(location=0) in vec4 Vertex;
layout(location=2) in vec3 Normal;
layout(location=3) in vec4 Color;
layout(location=8) in vec4 TexCoord;

out Attribs {
    vec4 couleur;
    vec3 normale;
    vec3 lumiere;
    vec3 observateur;
} AttribsOut;

vec4 calculerReflexion( in vec3 L, in vec3 N, in vec3 O )
{
    vec4 grisUniforme = vec4(0.7,0.7,0.7,1.0);
    return( grisUniforme );
}

void main( void )
{
    // transformation standard du sommet
    gl_Position = matrProj * matrVisu * matrModel * Vertex;

    //repère de l'observateur
    vec3 pos = vec3(matrVisu * matrModel * Vertex);

     // calculer la normale
    AttribsOut.normale = normalize(matrNormale * Normal);

    // calculer la lumiere (mais il y a [3] positions...)
    AttribsOut.lumiere = vec3( matrVisu * LightSource.position[0]) - pos;
   // AttribsOut.lumiere = ( LightSource.position[1] - pos);
    // AttribsOut.lumiere = ( LightSource.position[2] - pos);

    // calculer position de l'observateur
    AttribsOut.observateur = normalize(-pos);

    // Vecteur vers la lumiere
    vec3 L = (AttribsOut.lumiere);

    // Vecteur normale
    vec3 N =  (AttribsOut.normale);

    //vecteur position de l'observateur
    vec3 O = (AttribsOut.observateur);

    // couleur du sommet
    if(typeIllumination == GOURAUD)
        AttribsOut.couleur = calculerReflexion( L, N, O );
    else
         AttribsOut.couleur = Color; 

}
