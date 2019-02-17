// Prénoms, noms et matricule des membres de l'équipe:
// - Prénom1 NOM1 (matricule1)
// - Prénom2 NOM2 (matricule2)
//#warning "Écrire les prénoms, noms et matricule des membres de l'équipe dans le fichier et commenter cette ligne"

#define _CRT_SECURE_NO_WARNINGS

#include <stdlib.h>
#include <iostream>
#include "inf2705-matrice.h"
#include "inf2705-nuanceur.h"
#include "inf2705-fenetre.h"
#include "inf2705-forme.h"
#include <glm/gtx/io.hpp>
#include "Etat.h"
#include "Pipeline.h"
#include "Camera.h"
#include "Poisson.h"
#include "Aquarium.h"

Aquarium *aquarium = NULL;

void calculerPhysique( )
{
    aquarium->calculerPhysique( );
}

void chargerNuanceurs()
{
    // charger le nuanceur de base
    {
        // créer le programme
        progBase = glCreateProgram();

        // attacher le nuanceur de sommets
        {
            GLuint nuanceurObj = glCreateShader( GL_VERTEX_SHADER );
            glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesSommetsMinimal, NULL );
            glCompileShader( nuanceurObj );
            glAttachShader( progBase, nuanceurObj );
            ProgNuanceur::afficherLogCompile( nuanceurObj );
        }
        // attacher le nuanceur de fragments
        {
            GLuint nuanceurObj = glCreateShader( GL_FRAGMENT_SHADER );
            glShaderSource( nuanceurObj, 1, &ProgNuanceur::chainesFragmentsMinimal, NULL );
            glCompileShader( nuanceurObj );
            glAttachShader( progBase, nuanceurObj );
            ProgNuanceur::afficherLogCompile( nuanceurObj );
        }

        // faire l'édition des liens du programme
        glLinkProgram( progBase );
        ProgNuanceur::afficherLogLink( progBase );

        // demander la "Location" des variables
        if ( ( locColorBase = glGetAttribLocation( progBase, "Color" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de Color" << std::endl;
        if ( ( locmatrModelBase = glGetUniformLocation( progBase, "matrModel" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrModel" << std::endl;
        if ( ( locmatrVisuBase = glGetUniformLocation( progBase, "matrVisu" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrVisu" << std::endl;
        if ( ( locmatrProjBase = glGetUniformLocation( progBase, "matrProj" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrProj" << std::endl;
    }

    // charger le nuanceur de ce TP
    {
        // créer le programme
        prog = glCreateProgram();

        // attacher le nuanceur de sommets
        const GLchar *chainesSommets = ProgNuanceur::lireNuanceur( "nuanceurSommets.glsl" );
        if ( chainesSommets != NULL )
        {
            GLuint nuanceurObj = glCreateShader( GL_VERTEX_SHADER );
            glShaderSource( nuanceurObj, 1, &chainesSommets, NULL );
            glCompileShader( nuanceurObj );
            glAttachShader( prog, nuanceurObj );
            ProgNuanceur::afficherLogCompile( nuanceurObj );
            delete [] chainesSommets;
        }

        // partie 2: enlever le "#if 0" pour utiliser le nuanceur de géométrie
#if 1
        const GLchar *chainesGeometrie = ProgNuanceur::lireNuanceur( "nuanceurGeometrie.glsl" );
        if ( chainesGeometrie != NULL )
        {
            GLuint nuanceurObj = glCreateShader( GL_GEOMETRY_SHADER );
            glShaderSource( nuanceurObj, 1, &chainesGeometrie, NULL );
            glCompileShader( nuanceurObj );
            glAttachShader( prog, nuanceurObj );
            ProgNuanceur::afficherLogCompile( nuanceurObj );
            delete [] chainesGeometrie;
        }
# endif
        // attacher le nuanceur de fragments
        const GLchar *chainesFragments = ProgNuanceur::lireNuanceur( "nuanceurFragments.glsl" );
        if ( chainesFragments != NULL )
        {
            GLuint nuanceurObj = glCreateShader( GL_FRAGMENT_SHADER );
            glShaderSource( nuanceurObj, 1, &chainesFragments, NULL );
            glCompileShader( nuanceurObj );
            glAttachShader( prog, nuanceurObj );
            ProgNuanceur::afficherLogCompile( nuanceurObj );
            delete [] chainesFragments;
        }

        // faire l'édition des liens du programme
        glLinkProgram( prog );
        ProgNuanceur::afficherLogLink( prog );

        // demander la "Location" des variables
        if ( ( locmatrModel = glGetUniformLocation( prog, "matrModel" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrModel" << std::endl;
        if ( ( locmatrVisu = glGetUniformLocation( prog, "matrVisu" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrVisu" << std::endl;
        if ( ( locmatrProj = glGetUniformLocation( prog, "matrProj" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de matrProj" << std::endl;
    }
}

void FenetreTP::initialiser()
{
    // donner la couleur de fond
    glClearColor( 0.1, 0.1, 0.1, 1.0 );

    // activer les états openGL
    glEnable( GL_DEPTH_TEST );

    // activer le mélange de couleur pour la transparence
    glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );

    // charger les nuanceurs
    chargerNuanceurs();
    glUseProgram( prog );

    // créer l'aquarium
    aquarium = new Aquarium();
}

void FenetreTP::conclure()
{
    delete aquarium;
}

void FenetreTP::afficherScene( )
{
    // effacer les tampons de couleur, de profondeur et de stencil
    glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT );

    glUseProgram( progBase );

    // définir le pipeline graphique
    matrProj.Perspective( 50.0, (GLdouble) largeur_ / (GLdouble) hauteur_, 0.1, 100.0 );
    glUniformMatrix4fv( locmatrProjBase, 1, GL_FALSE, matrProj );

    camera.definir();
    glUniformMatrix4fv( locmatrVisuBase, 1, GL_FALSE, matrVisu );

    matrModel.LoadIdentity();
    glUniformMatrix4fv( locmatrModelBase, 1, GL_FALSE, matrModel );

    // afficher les axes
    if ( Etat::afficheAxes ) FenetreTP::afficherAxes(4);

    // afficher l'aquarium
    aquarium->afficher();

    // sélectionner ?
    if ( Etat::modeSelection )
    {
        // sélectionner un poisson
        aquarium->selectionnerPoisson( );

        // la sélection a été faite
        Etat::modeSelection = false;

        // (pas d'appel à swap(): il n'est pas pertinent de montrer ce qu'on vient de tracer pour la sélection)
    }
    else
    {
        // permuter plans avant et arrière
        swap();
    }
}

void FenetreTP::redimensionner( GLsizei w, GLsizei h )
{
	//glViewport(0, 0, w, h);

	GLfloat h2 = 0.5*h;

	glViewportIndexedf(0, 0, h2, w, h2);
	//glScissorIndexed(0, 0, h2, w, h2);
	glViewportIndexedf(1, 0, 0, w, h2);
	//glScissorIndexed(0, 0, 0, w, h2);
	//glEnable(GL_SCISSOR_TEST);
	
	//glViewport(0, h2, w, h2); // pour le viewport 0
	//glViewportIndexedf(1, 0, 0, w, h2); // pour le viewport 1
	//glScissorIndexed(1, 0, 0, w, h2);
	//glEnable(GL_SCISSOR_TEST);
}

void FenetreTP::clavier( TP_touche touche )
{
    switch ( touche )
    {
    case TP_ECHAP:
    case TP_q: // Quitter l'application
        quit();
        break;

    case TP_x: // Activer/désactiver l'affichage des axes
        Etat::afficheAxes = !Etat::afficheAxes;
        std::cout << "// Affichage des axes ? " << ( Etat::afficheAxes ? "OUI" : "NON" ) << std::endl;
        break;

    case TP_v: // Recharger les fichiers des nuanceurs et recréer le programme
        chargerNuanceurs();
        std::cout << "// Recharger nuanceurs" << std::endl;
        break;

    case TP_ESPACE: // Mettre en pause ou reprendre l'animation
        Etat::enmouvement = !Etat::enmouvement;
        break;

    case TP_c: // Déplacer le plan de rayonsX vers la droite (-X)
        Etat::planRayonsX.w -= 0.1;
        std::cout << " Etat::planRayonsX.w=" << Etat::planRayonsX.w << std::endl;
        break;

    case TP_z: // Déplacer le plan de rayonsX vers la gauche (+X)
        Etat::planRayonsX.w += 0.1;
        std::cout << " Etat::planRayonsX.w=" << Etat::planRayonsX.w << std::endl;
        break;

    case TP_HAUT: // Déplacer le plan de dragage vers le haut
        Etat::planDragage.w += 0.1;
        std::cout << " Etat::planDragage.w=" << Etat::planDragage.w << std::endl;
        break;

    case TP_BAS: // Déplacer le plan de dragage vers le bas
        Etat::planDragage.w -= 0.1;
        std::cout << " Etat::planDragage.w=" << Etat::planDragage.w << std::endl;
        break;

    case TP_CROCHETDROIT:
    case TP_DROITE: // Augmenter l'angle du plan de dragage
        Etat::angleDragage += 1.0; if ( Etat::angleDragage > 60 ) Etat::angleDragage = 60;
        Etat::planDragage.x = sin(glm::radians(Etat::angleDragage));
        Etat::planDragage.z = cos(glm::radians(Etat::angleDragage));
        std::cout << " Etat::angleDragage=" << Etat::angleDragage << std::endl;
        break;
    case TP_CROCHETGAUCHE:
    case TP_GAUCHE: // Diminuer l'angle du plan de dragage
        Etat::angleDragage -= 1.0; if ( Etat::angleDragage < -60 ) Etat::angleDragage = -60;
        Etat::planDragage.x = sin(glm::radians(Etat::angleDragage));
        Etat::planDragage.z = cos(glm::radians(Etat::angleDragage));
        std::cout << " Etat::angleDragage=" << Etat::angleDragage << std::endl;
        break;

    case TP_PLUS: // Incrémenter la distance de la caméra
    case TP_EGAL:
        camera.dist--;
        std::cout << " camera.dist=" << camera.dist << std::endl;
        break;

    case TP_SOULIGNE:
    case TP_MOINS: // Décrémenter la distance de la caméra
        camera.dist++;
        std::cout << " camera.dist=" << camera.dist << std::endl;
        break;

    case TP_a: // Atténuer ou non la couleur selon l'éloignement
        Etat::attenuation = !Etat::attenuation;
        std::cout << " Etat::attenuation=" << Etat::attenuation << std::endl;
        break;

    default:
        std::cout << " touche inconnue : " << (char) touche << std::endl;
        imprimerTouches();
        break;
    }
}

static bool presse = false;
void FenetreTP::sourisClic( int button, int state, int x, int y )
{
    presse = ( state == TP_PRESSE );
    if ( presse )
    {
        switch ( button )
        {
        default:
        case TP_BOUTON_GAUCHE: // Modifier le point de vue
            Etat::modeSelection = false;
            break;
        case TP_BOUTON_DROIT: // Sélectionner des objets
            Etat::modeSelection = true;
            break;
        }
        Etat::sourisPosPrec.x = x;
        Etat::sourisPosPrec.y = y;
    }
    else
    {
        Etat::modeSelection = false;
    }
}

void FenetreTP::sourisMolette( int x, int y ) // Déplacer le plan de dragage
{
    const int sens = +1;
    Etat::planDragage.w += 0.05 * sens * y;
    std::cout << " Etat::planDragage.w=" << Etat::planDragage.w << std::endl;
}

void FenetreTP::sourisMouvement( int x, int y )
{
    if ( presse )
    {
        if ( !Etat::modeSelection )
        {
            int dx = x - Etat::sourisPosPrec.x;
            int dy = y - Etat::sourisPosPrec.y;
            camera.theta -= dx / 3.0;
            camera.phi   -= dy / 3.0;
        }

        Etat::sourisPosPrec.x = x;
        Etat::sourisPosPrec.y = y;

        camera.verifierAngles();
    }
}

int main( int argc, char *argv[] )
{
    // créer une fenêtre
    FenetreTP fenetre( "INF2705 TP" );

    // allouer des ressources et définir le contexte OpenGL
    fenetre.initialiser();

    bool boucler = true;
    while ( boucler )
    {
        // mettre à jour la physique
        calculerPhysique( );

        // affichage
        fenetre.afficherScene();

        // récupérer les événements et appeler la fonction de rappel
        boucler = fenetre.gererEvenement();
    }

    // détruire les ressources OpenGL allouées
    fenetre.conclure();

    return 0;
}
