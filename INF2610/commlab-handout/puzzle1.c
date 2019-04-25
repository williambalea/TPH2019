/*
 * Comm Lab - puzzle1.c
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
#include <signal.h>
// -------------------------------------------------

#include "libcommlab.h"

void puzzle1() {
    // TODO
    int fd;
    char* fifoInput = "/tmp/pipe_6b2e6d9b";
    char* fifoOutput = "/tmp/pipe_d95ada50";
    char buff[200];
    mkfifo(fifoInput, S_IRUSR | S_IWUSR);
    mkfifo(fifoOutput, S_IRUSR | S_IWUSR);
    pid_t fils = fork();
    if (fils == 0) {
        execl("./puzzle1/exchanger", "exchanger", NULL);
    }
    fd = open(fifoInput, O_WRONLY);
    write(fd,"a951e0607303\0", 13 );  
    kill(fils, SIGUSR2);
    close(fd);
    fd = open(fifoOutput, O_RDONLY);
    read(fd, buff, sizeof(buff) );
    close(fd);
    checkExchangerMessage(buff);
    wait(NULL);
    // strace donne le path du tube
    // ltrace donne
}