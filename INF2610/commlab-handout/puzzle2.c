/*
 * Comm Lab - puzzle2.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

// TODO
// Si besoin, ajouter ici les directives d'inclusion
// -------------------------------------------------
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/wait.h>
#include <fcntl.h>
// -------------------------------------------------

void puzzle2() {
    // TODO
    
    int pipeFd[2];
    pipe(pipeFd);
    pid_t fils = fork();
    unsigned char jeton[] = {141, 146, 151, 151, 137, 130, 42, 185, 42,
                             190, 127, 183, 183, 185, 130, 190, 185, 129, 185, 129, 187, 42,
                             144, 145, 140, 141, 0};
    if(fils == 0) {
        close(pipeFd[1]);
        char buf[50];
        sprintf(buf,"%d", pipeFd[0]);
        execl("./puzzle2/telegraph", "telegraph", buf, NULL);
    }
    close(pipeFd[0]);
    write(pipeFd[1], jeton, sizeof(jeton));    
    close(pipeFd[1]);
    wait(NULL);
}