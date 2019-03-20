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

uniform sampler2D laTextureCoul;
uniform sampler2D laTextureNorm;

const int GOURAUD = 0;
const int PHONG = 1;

/////////////////////////////////////////////////////////////////

in Attribs {
    vec4 couleur;
	vec3 normale, obsVec;
	vec3 lumiDir[3];
	vec2 textCoord;
} AttribsIn;

out vec4 FragColor;

vec4 calculerReflexion( in vec3 L, in vec3 N, in vec3 O )
{
	// ajout de l'emission de l'ambiant du modele d'illumination
	vec4 coul = (FrontMaterial.emission + FrontMaterial.ambient * LightModel.ambient);
	
	// calcul de la composante ambiante de la source de lumiere
	coul += FrontMaterial.ambient * LightSource.ambient;
	
	// produit scalaire pour le calcul de la reflexion diffuse
	//float NdotL = max( 0.0, dot(N, L) );
	float NdotL = dot(N, L);

	if(NdotL > 0.0) {
		// calcul de la composante diffuse de la source de lumiere
		coul += FrontMaterial.diffuse * LightSource.diffuse * NdotL;
	
		// calcul de la composante speculaire selon Blinn ou Phong
		float NdotHV = max ( 0.0, (utiliseBlinn) ? dot(normalize(L + O), N) : dot(reflect(-L, N), O));
		coul += FrontMaterial.specular * LightSource.specular * ((NdotHV == 0.0) ? 0.0 : pow(NdotHV, FrontMaterial.shininess));
	}

	return clamp(coul, 0.0, 1.0);

}

vec4 calculerReflexionGris( in vec3 L, in vec3 N, in vec3 O ) {
	// ajout de l'emission de l'ambiant du modele d'illumination
	vec4 coul = (FrontMaterial.emission + FrontMaterial.ambient * LightModel.ambient);
	
	// calcul de la composante ambiante de la source de lumiere
	coul += FrontMaterial.ambient * LightSource.ambient;
	
	// produit scalaire pour le calcul de la reflexion diffuse
	//float NdotL = max( 0.0, dot(N, L) );
	float NdotL = dot(N, L);

	if(NdotL > 0.0) {
		// calcul de la composante diffuse de la source de lumiere
		coul += vec4(0.7, 0.7, 0.7, 1.0) * LightSource.diffuse * NdotL;
	
		// calcul de la composante speculaire selon Blinn ou Phong
		float NdotHV = max ( 0.0, (utiliseBlinn) ? dot(normalize(L + O), N) : dot(reflect(-L, N), O));
		coul += FrontMaterial.specular * LightSource.specular * ((NdotHV == 0.0) ? 0.0 : pow(NdotHV, FrontMaterial.shininess));
	}

	return clamp(coul, 0.0, 1.0);
}

void calculerLumiere() {
	FragColor = vec4(0.0);
	for (int i = 0; i < 3; i++)
		FragColor += calculerReflexion(normalize(AttribsIn.lumiDir[i]), AttribsIn.normale, normalize(AttribsIn.obsVec));

}

void calculerLumiereGrise() {
	FragColor = vec4(0.0);
	for (int i = 0; i < 3; i++)
		FragColor += calculerReflexionGris(normalize(AttribsIn.lumiDir[i]), AttribsIn.normale, normalize(AttribsIn.obsVec));

}

void main( void )
{
	if (typeIllumination == GOURAUD) {

		FragColor = AttribsIn.couleur * texture(laTextureCoul, AttribsIn.textCoord);

		if (numTexCoul == 0)
			FragColor =  AttribsIn.couleur;

	} else if (typeIllumination == PHONG) {

		if (utiliseCouleur) {
			calculerLumiere();

			if(numTexCoul != 0)
				FragColor *= texture(laTextureCoul, AttribsIn.textCoord);

		} else {

			calculerLumiereGrise();
			FragColor *= texture(laTextureCoul, AttribsIn.textCoord);

			if(numTexCoul == 0)
				calculerLumiereGrise();

			FragColor *= vec4(0.7, 0.7, 0.7, 1.0);
		}

	}
}
