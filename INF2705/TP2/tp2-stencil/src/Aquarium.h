#ifndef __AQUARIUM_H__
#define __AQUARIUM_H__

#include <vector>
#include <iterator>
#include <iomanip> // temporaire

//
// l'aquarium
//
class Aquarium
{
    static FormeCube *cubeFil;
    static FormeCube *cube;
public:
    Aquarium( )
        : locplanDragage(-1), locplanRayonsX(-1), locattenuation(-1)
    {
        // les positions des 25 poissons
        glm::vec3 pos[] =
        {
            glm::vec3( 0.0,  6.8,  0.0 ),
            glm::vec3( 0.0,  0.3,  2.1 ),
            glm::vec3( 0.0, -3.3,  0.0 ),
            glm::vec3( 0.0,  0.2,  5.3 ),
            glm::vec3( 0.0,  3.3,  2.4 ),
            glm::vec3( 0.0,  6.4,  2.8 ),
            glm::vec3( 0.0, -6.5, -5.3 ),
            glm::vec3( 0.0,  0.0,  0.0 ),
            glm::vec3( 0.0, -6.6, -2.5 ),
            glm::vec3( 0.0, -6.5,  2.7 ),
            glm::vec3( 0.0, -3.3, -5.7 ),
            glm::vec3( 0.0,  3.3, -5.2 ),
            glm::vec3( 0.0,  6.2, -2.5 ),
            glm::vec3( 0.0,  3.2, -2.2 ),
            glm::vec3( 0.0, -6.7,  0.0 ),
            glm::vec3( 0.0, -3.5, -2.5 ),
            glm::vec3( 0.0,  3.7,  0.0 ),
            glm::vec3( 0.0,  3.8,  5.3 ),
            glm::vec3( 0.0, -6.1,  5.3 ),
            glm::vec3( 0.0, -3.3,  5.1 ),
            glm::vec3( 0.0,  6.5,  5.1 ),
            glm::vec3( 0.0,  6.1, -5.3 ),
            glm::vec3( 0.0,  0.0, -5.3 ),
            glm::vec3( 0.0,  0.1, -2.5 ),
            glm::vec3( 0.0, -3.4,  2.2 ),
        };

        // créer un aquarium graphique
        initialiserGraphique();

        // initialiser la génération de valeurs aléatoires pour la création de poissons
        srand( time(NULL) );

        // remplir l'aquarium
        for ( unsigned int i = 0 ; i < sizeof(pos)/sizeof(pos[0]) ; ++i )
        {
            // donner position aléatoire en x
            pos[i].x = glm::mix( -0.9*Etat::bDim.x, 0.9*Etat::bDim.x, rand()/((double)RAND_MAX) );
            // donner vitesse aléatoire en x
            glm::vec3 vit = glm::vec3( glm::mix( -0.2, 0.2, rand()/((double)RAND_MAX) ), 0.0, 0.0 );
            vit.x += 0.1 * glm::sign(vit.x); // ajouter ou soustraire 0.1 selon le signe de vx afin d'avoir : 0.1 <= abs(vx) <= 0.3
            // donner taille aléatoire
            float taille = glm::mix( 0.5 , 0.9, rand()/((double)RAND_MAX) );

            // créer un nouveau poisson
            double valeurVerte = (1/2);
            std::cout << std::fixed;
            std::cout << std::setprecision(3);
            std::cout << i << " " << 1/2 << std::endl;
            Poisson *p = new Poisson( pos[i], vit, taille, false, 0.1 ); // nombre magique à redefinir
            //std::cout << "poisson " << i << " valeurVerte : " << p->valeurVerte;

            // assigner une couleur de sélection
            // partie 2: modifs ici ...
           
            // ajouter ce poisson dans la liste
            poissons.push_back( p );
        }

        // créer quelques autres formes
        if ( cubeFil == NULL ) cubeFil = new FormeCube( 2.0, false );
        if ( cube == NULL ) cube = new FormeCube( 2.0 );
    }
    ~Aquarium()
    {
        conclureGraphique();
        // vider l'aquarium
        while ( !poissons.empty() ) poissons.pop_back( );
    }
    void initialiserGraphique()
    {
        GLint prog = 0; glGetIntegerv( GL_CURRENT_PROGRAM, &prog );
        if ( prog <= 0 )
        {
            std::cerr << "Pas de programme actif!" << std::endl;
            locVertex = locColor = -1;
            return;
        }
        if ( ( locVertex = glGetAttribLocation( prog, "Vertex" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de Vertex" << std::endl;
        if ( ( locColor = glGetAttribLocation( prog, "Color" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de Color" << std::endl;
        if ( ( locplanDragage = glGetUniformLocation( prog, "planDragage" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de planDragage" << std::endl;
        if ( ( locplanRayonsX = glGetUniformLocation( prog, "planRayonsX" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de planRayonsX" << std::endl;
        if ( ( locattenuation = glGetUniformLocation( prog, "attenuation" ) ) == -1 ) std::cerr << "!!! pas trouvé la \"Location\" de attenuation" << std::endl;

        // les valeurs à utiliser pour tracer le quad
        GLfloat coo[] = { -1,  1, 0,
                           1,  1, 0,
                           1, -1, 0,
                          -1, -1, 0 };
        const GLuint connec[] = { 0, 1, 2, 2, 3, 0 };

        vao = vbo[0] = vbo[1] = 0;
        // *** l'initialisation des objets graphiques doit être faite seulement après l'initialisation de la fenêtre graphique

        // partie 1: initialiser le VAO (pour le quad de l'aquarium)
		glGenVertexArrays(1, &vao);
		glBindVertexArray(vao);

        // partie 1: créer les deux VBO pour les sommets et la connectivité


		glGenBuffers(2, vbo);
		// tracer le quad
		glBindBuffer(GL_ARRAY_BUFFER, vbo[0]);
		glBufferData( GL_ARRAY_BUFFER, sizeof(coo), coo, GL_STATIC_DRAW );
		glVertexAttribPointer( locVertex, 3, GL_FLOAT, GL_FALSE, 0, 0 );
		glBindBuffer( GL_ELEMENT_ARRAY_BUFFER, vbo[1] );
        glBufferData( GL_ELEMENT_ARRAY_BUFFER, sizeof(connec), connec, GL_STATIC_DRAW );
        glEnableVertexAttribArray(locVertex);
        glBindVertexArray( 0 );
    }
    void conclureGraphique()
    {
        glDeleteBuffers( 2, vbo );
        glDeleteVertexArrays( 1, &vao);
        delete cubeFil;
        delete cube;
    }

    void afficherParois()
    {
        // tracer les parois de verre de l'aquarium
        glEnable( GL_CULL_FACE ); glCullFace( GL_FRONT ); // ne pas afficher les faces avant
        glVertexAttrib3f( locColorBase, 0.1, 0.1, 0.3 ); // bleuté
        matrModel.PushMatrix();{
            matrModel.Scale( Etat::bDim.x, Etat::bDim.y, Etat::bDim.z );
            glUniformMatrix4fv( locmatrModelBase, 1, GL_FALSE, matrModel );
           cube->afficher();
        }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModelBase, 1, GL_FALSE, matrModel );
        glDisable( GL_CULL_FACE );

        // tracer les coins de l'aquarium
        glVertexAttrib3f( locColorBase, 1.0, 1.0, 1.0 ); // blanc
        matrModel.PushMatrix();{
            matrModel.Scale( 0.999*Etat::bDim.x, 0.999*Etat::bDim.y, 0.999*Etat::bDim.z ); // légèrement à l'intérieur
            glUniformMatrix4fv( locmatrModelBase, 1, GL_FALSE, matrModel );
            cubeFil->afficher();
        }matrModel.PopMatrix(); glUniformMatrix4fv( locmatrModelBase, 1, GL_FALSE, matrModel );
    }

    void afficherPlan( GLfloat alpha ) // le plan qui ferme les solides
    {
        glVertexAttrib4f( locColor, 1.0, 1.0, 1.0, alpha );
        // afficher le plan mis à l'échelle, tourné selon l'angle courant et à la position courante
        // partie 1: modifs ici ...
        
        matrModel.PushMatrix(); {
            
			// transformations
            matrModel.Rotate(Etat::angleDragage, 0.0, 1.0, 0.0);
            matrModel.Translate(0.0, 0.0, Etat::planDragage.w);
			matrModel.Scale(Etat::bDim.x, Etat::bDim.y, 1.0);
			
            glEnable(GL_BLEND);
            
			// avant de tracer, informer le gpu des chgmt fait à la matrice de modelisation
			glUniformMatrix4fv(locmatrModel, 1, GL_FALSE, matrModel);
			// afficher le quad:
			glBindVertexArray(vao);
			glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
			glBindVertexArray( 0 );
			
		}matrModel.PopMatrix(); 
        glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
			
		
    }

    void afficherTousLesPoissons()
    {
        glVertexAttrib4f( locColor, 1.0, 1.0, 1.0, 1.0 );

        for ( std::vector<Poisson*>::iterator it = poissons.begin() ; it != poissons.end() ; it++ )
        {
            (*it)->afficher();
        }
    }

    // afficher les poissons
    void afficherFaune()
    {
        // partie 1: modifs ici ...
        // afficher les poissons en plein et en fil de fer en tenant compte du plan de rayonsX,
        // puis tenir compte aussi du plan de dragage
		
        // activer les plans de coupe et afficher la scène normalement
        // partie 1: modifs ici ...
        glEnable(GL_CLIP_PLANE0);
        
        // affiche cote gauche plein
        glEnable(GL_CLIP_PLANE1);
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        afficherTousLesPoissons();
        glDisable(GL_CLIP_PLANE1);

        // affiche cote droit fil fer
        glEnable(GL_CLIP_PLANE2);
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        afficherTousLesPoissons();
        glDisable(GL_CLIP_PLANE2);

        //aquarium
        glEnable(GL_STENCIL_TEST);
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL); 
        glColorMask(GL_FALSE, GL_FALSE, GL_FALSE, GL_FALSE);
        glDisable(GL_DEPTH_TEST);
        glEnable(GL_CULL_FACE);
        glStencilFunc(GL_ALWAYS, 1, 0xff);
        glCullFace(GL_FRONT);
        glStencilOp(GL_KEEP, GL_INCR, GL_INCR);
        afficherTousLesPoissons();
        glCullFace(GL_BACK);
        glStencilOp(GL_KEEP, GL_DECR, GL_DECR);
        afficherTousLesPoissons();
        glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
        glEnable(GL_DEPTH_TEST);
        glDisable(GL_CULL_FACE);
        glStencilOp(GL_KEEP, GL_KEEP, GL_KEEP);
        glStencilFunc(GL_EQUAL, 1, 0xff);
        glDisable(GL_CLIP_PLANE0);
        afficherPlan(1.0);
        glDisable(GL_STENCIL_TEST);
        

    }

    // afficher le contenu de l'aquarium
    void afficher()
    {
        // tracer les parois de l'aquarium avec le programme de nuanceur de base
        glUseProgram( progBase );
        afficherParois( );

        // tracer le reste de l'aquarium avec le second programme de nuanceur
        glUseProgram( prog );
        glUniformMatrix4fv( locmatrProj, 1, GL_FALSE, matrProj );
        glUniformMatrix4fv( locmatrVisu, 1, GL_FALSE, matrVisu );
        glUniformMatrix4fv( locmatrModel, 1, GL_FALSE, matrModel );
        // La valeur w de la variable planDragage est la position du plan en Z, c'est-à-dire Z = w.
        // Il faut donc inverser le signe de w dans l'équation du plan de coupe à transmettre au nuanceur afin d'avoir Ax+By+Cz-w=0 :
        glm::vec4 planD = Etat::planDragage; planD.w = -planD.w;
        glUniform4fv( locplanDragage, 1, glm::value_ptr(planD) );
        // La valeur w de la variable planRayonsX est la position du plan en X, c'est-à-dire X = w.
        // Il faut donc inverser le signe de w dans l'équation du plan de coupe à transmettre au nuanceur afin d'avoir Ax+By+Cz-w=0 :
        glm::vec4 planR = Etat::planRayonsX; planR.w = -planR.w;
        glUniform4fv( locplanRayonsX, 1, glm::value_ptr(planR) );

        glUniform1i( locattenuation, Etat::attenuation );

        // afficher les poissons
        afficherFaune();

        // en plus, dessiner le plan de dragage en transparence pour bien voir son étendue
        afficherPlan( 0.25 );
    }

    // sélectionner un poisson
    void selectionnerPoisson()
    {
        // partie 2: modifs ici ...
        glFinish();
        GLint cloture[4];
        glGetIntegerv(GL_VIEWPORT, cloture);
        GLint posX = Etat::sourisPosPrec.x, posY = cloture[3]-Etat::sourisPosPrec.y;
        std::cout << "posX = " << posX << std::endl
                  << "posY = " << posY << std::endl;
        glReadBuffer( GL_BACK );
        GLubyte couleur[3] = {0, 0, 0};
        glReadPixels( posX, posY, 1, 1, GL_RGB, GL_UNSIGNED_BYTE, couleur );
        std::cout << "apres ReadPixel: " << (float)couleur[0] << ", " << (float)couleur[1] << ", " << (float)couleur[2] << std::endl; 
        for (unsigned int i = 0; i < poissons.size(); i++) {
            if ( poissons.at(i)->valeurVerte == couleur[1]) {
                poissons.at(i)->estSelectionne = !poissons.at(i)->estSelectionne;
                std::cout << "on a selectionne le poisson #" << i << std::endl;
                break;
                
            }

        }
        std::cout << "Couleur  = " << (int) couleur[0] << " " << (int) couleur[1] << " " << (int) couleur[2] << std::endl;
    }

    void calculerPhysique( )
    {
        if ( Etat::enmouvement )
        {
            for ( std::vector<Poisson*>::iterator it = poissons.begin() ; it != poissons.end() ; it++ )
            {
                (*it)->avancerPhysique();
            }
#if 0
            // Quelques déplacements automatiques pour la démo :
            static int sens[6] = { +1, +1, +1, +1, +1, +1 };
            glm::vec3 vitesse( 0.03, 0.02, 0.05 );
            // la distance de RayonsX
            if ( Etat::planRayonsX.w <= -4.0 ) sens[0] = +1.0;
            else if ( Etat::planRayonsX.w >= 4.0 ) sens[0] = -1.0;
            Etat::planRayonsX.w += 0.05 * sens[0];
            // la hauteur de dragage
            if ( Etat::planDragage.w <= -4.0 ) sens[1] = +1.0;
            else if ( Etat::planDragage.w >= 4.0 ) sens[1] = -1.0;
            Etat::planDragage.w += 0.03 * sens[1];
            // l'angle de dragage
            if ( Etat::angleDragage <= -10.0 ) sens[2] = +1.0;
            else if ( Etat::angleDragage >= 10.0 ) sens[2] = -1.0;
            Etat::angleDragage += 0.05 * sens[2];
            Etat::planDragage.x = sin(glm::radians(Etat::angleDragage));
            Etat::planDragage.z = cos(glm::radians(Etat::angleDragage));
#endif
        }
    }

    // utilisation de vbo et vao
    GLuint vao;
    GLuint vbo[2];
    GLint locplanDragage;
    GLint locplanRayonsX;
    GLint locattenuation;
    GLfloat greenValue = 1.0;

    // la liste des poissons
    std::vector<Poisson*> poissons;
};

FormeCube* Aquarium::cubeFil = NULL;
FormeCube* Aquarium::cube = NULL;

#endif
