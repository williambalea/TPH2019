/*
 * Clone Lab - part2.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

#include "libclonelab.h"

#include <stdio.h>

// TODO
// Si besoin, ajouter ici les directives d'inclusion
// -------------------------------------------------
#include <unistd.h>
#include <stdio.h>
#include <sys/wait.h>
#include <stdlib.h>
// -------------------------------------------------

#define PART2_OUTPUT_FILE_PATH "part2Output.txt"

void part2() {
    // Ouverture du fichier de sortie pour la question 2.3
    FILE* part2OutputFile = fopen(PART2_OUTPUT_FILE_PATH, "a");
    char buf[50];
    pid_t pere0 = getpid();
    sprintf(buf,"%d", pere0);
    if(fork() == 0) {
        pid_t fils11 = getpid();
        registerProc(1, 1, fils11, pere0);
        

        if(fork() == 0) {
            pid_t fils21 = getpid();    
            registerProc(2, 1, fils21, fils11);
            execl("./part2/level2.1", "level2.1", NULL);
        }
        execl("./part2/level1.1", "level1.1", buf, NULL);
    }

    if(fork() == 0) {
        pid_t fils12 = getpid();    
        registerProc(1, 2, fils12, pere0);
    
        if(fork() == 0) {
            pid_t fils22 = getpid();    
            registerProc(2, 2, fils22, fils12);
            execl("./part2/level2.2", "level2.2", NULL);
        }  
        execl("./part2/level1.2", "level1.2", buf, NULL);
    }

    if(fork() == 0) {
        pid_t fils13 = getpid();    
        registerProc(1, 3, fils13, pere0);
    
        if(fork() == 0) {
            pid_t fils23 = getpid();    
            registerProc(2, 3, fils23, fils13);
            execl("./part2/level2.3", "level2.3", NULL);
        }  
        execl("./part2/level1.3", "level1.3", buf, NULL);
    }

    if(fork() == 0) {
        pid_t fils14 = getpid();    
        registerProc(1, 4, fils14, pere0);
    
        if(fork() == 0) {
            pid_t fils24 = getpid();    
            registerProc(2, 4, fils24, fils14);
            execl("./part2/level2.4", "level2.4", NULL);
        }
        if(fork() == 0) {
            pid_t fils25 = getpid();    
            registerProc(2, 5, fils25, fils14);
            execl("./part2/level2.5", "level2.5", NULL);
        }
        execl("./part2/level1.4", "level1.4", buf, NULL);
    }

    execl("./part2/level0", "level0", "7b07b79784dc304b460f699c", NULL);
    
}