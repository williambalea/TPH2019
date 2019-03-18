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
const int GOURAUD = 0;
const int PHONG = 1;
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
	vec3 normale, obsVec;
	vec3 lumiDir[3];
} AttribsOut;

vec4 calculerReflexion( in vec3 L, in vec3 N, in vec3 O )
{
	// ajout de l'emission de l'ambiant du modele d'illumination
	vec4 couleur = FrontMaterial.emission + FrontMaterial.ambient * LightModel.ambient;
	
	// calcul de la composante ambiante de la source de lumiere
	couleur += FrontMaterial.ambient * LightSource.ambient;

    // produit scalaire pour le calcul de la reflexion diffuse
	float NdotL = max( 0.0, dot(N, L) );
	
	// calcul de la composante diffuse de la source de lumiere
	couleur += FrontMaterial.diffuse * LightSource.diffuse * NdotL;
	
	// calcul de la composante speculaire selon Blinn ou Phong
	float NdotHV = max ( 0.0, (utiliseBlinn) ? dot(normalize(L + O), N) : dot(reflect(-L, N), O));
	couleur += FrontMaterial.specular * LightSource.specular * ((NdotHV == 0.0) ? 0.0 : pow(NdotHV, FrontMaterial.shininess));
	
	return clamp(couleur, 0.0, 1.0);
}

void main( void )
{
    // transformation standard du sommet
    gl_Position = matrProj * matrVisu * matrModel * Vertex;

	
	// calculer la normale (N) pour fragment shader
	AttribsOut.normale = matrNormale * Normal;

	// calculer la position (P) du sommet dans le repere de la camera
	vec3 pos = (matrVisu * matrModel * Vertex).xyz;

	// calculer vecteur de la direction (L) des trois sources de lumiere
	for (int i = 0; i < 3; i++) {
	if(LightSource.position[0].w > 0.0)
		AttribsOut.lumiDir[i] = (matrVisu * LightSource.position[i] / LightSource.position[i].w).xyz - pos; 
	else
		AttribsOut.lumiDir[i] = (matrVisu * LightSource.position[i]).xyz; 
	}

	// calculer vecteur de la direction (O) vers l'observateur
	AttribsOut.obsVec = (LightModel.localViewer ? normalize(-pos) : vec3(0.0, 0.0, 1.0) );
	if (typeIllumination == GOURAUD) {
    // couleur du sommet
	for (int i = 0; i < 3; i++) {
		AttribsOut.couleur += calculerReflexion(normalize(AttribsOut.lumiDir[i]), normalize(AttribsOut.normale), normalize(AttribsOut.obsVec));
		}
	}
	else if (typeIllumination == PHONG){
		AttribsOut.couleur = Color;
		}
}
