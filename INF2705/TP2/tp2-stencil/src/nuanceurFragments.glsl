#version 410

uniform int attenuation;
const float debAttenuation = 30.0;
const float finAttenuation = 50.0;

in Attribs {
    vec4 couleur;
} AttribsIn;

out vec4 FragColor;

void main( void )
{
    // la couleur du fragment est la couleur interpolée
    //FragColor = mix(AttribsIn.couleur, vec4(0.0, 1.0, 1.0, 0.2), AttribsIn.couleur.w); // -> couleur.w affecte juste les poissons

	//FragColor = vec4(vec3(AttribsIn.couleur.w), 1.0);

	FragColor = AttribsIn.couleur;
	//FragColor = vec4(0.43, 0.65, 0.0, 1.0);
	//FragColor = a;





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
