/*
 * Clone Lab - part1.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

// TODO
// Si besoin, ajouter ici les directives d'inclusion
// -------------------------------------------------
#include <unistd.h>
#include <stdio.h>
#include <sys/wait.h>
#include <stdlib.h>
// -------------------------------------------------

void part1() {
    // TODO
 pid_t pidRecu = fork();
    if(pidRecu == 0) {
        char buf[50];
        sprintf(buf,"%d", getppid());
        execl("./part1/ralph", "ralph", "--P", buf, NULL);
        exit(0);
    }
    else {
        char buf[50];
        sprintf(buf,"%d", pidRecu);
        execl("./part1/inocencia","inocencia", "--P", buf, NULL);
        exit(0);
    }
    wait(NULL);

}