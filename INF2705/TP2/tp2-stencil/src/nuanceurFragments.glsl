#version 410

uniform int attenuation;
const float debAttenuation = 30.0;
const float finAttenuation = 50.0;


//vec4 colorB = vec4();

in Attribs {
    vec4 couleur;
} AttribsIn;

out vec4 FragColor;

void main( void )
{
    
    // Donne les couleurs des poissons
	FragColor = AttribsIn.couleur;

    // atténuer selon la profondeur
    if ( attenuation == 1 )
    {
		

        // Obtenir la distance à la caméra du sommet dans le repère de la caméra
        float dist = gl_FragCoord.z / gl_FragCoord.w;
        // Obtenir un facteur d'interpolation entre 0 et 1
        float factDist = smoothstep(finAttenuation, debAttenuation, dist );
        // Modifier la couleur du fragment en utilisant ce facteur
        FragColor = FragColor * vec4( vec3(factDist), 1.0);
		

        // pour déboguer et « voir » le facteur ou la distance, on peut utiliser:
        //FragColor = vec4( vec3(factDist), 1.0 );
        //FragColor = vec4( vec3(dist-floor(dist)), 1.0 );
    }

    // pour déboguer et « voir » le comportement de z ou w, on peut utiliser:
    //FragColor = vec4( vec3(gl_FragCoord.z), 1.0 );
    //FragColor = vec4( vec3(gl_FragCoord.w), 1.0 );
}
