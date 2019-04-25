/*
 * Init Lab - q2.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

// TODO
// Si besoin, ajouter ici les directives d'inclusion
// -------------------------------------------------
#include<stdio.h>
#include<unistd.h>
// -------------------------------------------------

/*
 * Vous devez imprimer le message indiqué dans l'énoncé:
 * - En exécutant un premier appel à printf AVANT l'appel à write
 * - Sans utiliser la fonction fflush
 * - En terminant chaque ligne par le caractère '\n' de fin de ligne
 */
void question2() {
    // TODO
    printf("99c9405f7ec6 (printed using printf)");
	write(1,"99c9405f7ec6 (printed using write)\n", 35);
	printf("\n");
	
    // printf : sans de \n, c'est write qui s'écrit en premier
    // write : (fd) , buf , nb des string
    // selon le file descriptor (fd):
    // 0: stdin
    // 1: stdout
    // 2: stderr
}
