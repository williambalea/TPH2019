/*
 * Mem Lab - memsim.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

#include "memsim.h"
#include "memsim/libmemsim.h"
#include "libmemlab.h"

// TODO
// Si besoin, ajoutez ici les directives d'inclusion
// -------------------------------------------------
#include <stdlib.h>
// -------------------------------------------------

// TODO
// Si besoin, définissez ici des fonctions supplémentaires
// -------------------------------------------------------

// -------------------------------------------------------

/*
 * Calcule et renvoie le déplacement dans la page correspondant à l'adresse
 * fournie en argument.
 */
unsigned long getPageOffset(unsigned long addr) {
    // TODO

    return addr % 1024;
}

/*
 * Calcule et renvoie le numéro de page correspondant à l'adresse virtuelle
 * fournie en argument.
 */
unsigned long getPageNumber(unsigned long addr) {
    // TODO
    return addr >> 10;
}

/*
 * Calcule et renvoie l'adresse de début de page (ou cadre) correspondant au
 * numéro de page (ou de cadre) fourni en argument.
 */
unsigned long getStartPageAddress(unsigned long pageNumber) {
    // TODO

    return pageNumber << 10;
}

/*
 * Initialise votre structure permettant de stocker l'état de la mémoire
 * 
 * Retourne:
 * - un pointeur vers une structure initialisée stockant l'état de la mémoire
 */
struct paging_system_state *initMemoryState() {
    // TODO
    struct paging_system_state* ms = malloc(sizeof(struct paging_system_state));

    struct pt* pt = malloc(sizeof(struct pt));
    pt->frameNumbers = calloc(1024, sizeof(unsigned long));
    pt->isValid = calloc(1024, sizeof(char));
    for (int i = 0; i < 1024; i++) {
        pt->isValid[i] = '0';
    }
    ms->pt = pt;

    struct tlb* tlb = malloc(sizeof(struct tlb));
    tlb->pageNumbers = calloc(32, sizeof(unsigned long));
    tlb->frameNumbers = calloc(32, sizeof(unsigned long));
    tlb->lastAccessTimestamps = calloc(32, sizeof(unsigned long));
    tlb->entryCreationTimestamps = calloc(32, sizeof(unsigned long));
    tlb->isUsed = calloc(32, sizeof(char));
    for (int i = 0; i< 32; i++){
       tlb->isUsed[i] = '0'; 
    }
    ms->tlb = tlb;

    struct memory* mem = malloc(sizeof(struct memory));
    mem->pageNumbers = calloc(424, sizeof(unsigned long));
    mem->lastAccessTimestamps = calloc(424, sizeof(unsigned long));
    mem->entryCreationTimestamps = calloc(424, sizeof(unsigned long));
    mem->isUsed = calloc(424, sizeof(char));
    for (int i = 0; i< 424; i++){
       mem->isUsed[i] = '0'; 
    }
    ms->mem = mem;

    return ms;
}

/*
 * Cherche la traduction de l'adresse virtuelle dans le TLB.
 * 
 * Si la traduction est trouvée dans le TLB, modifier les champs:
 * - mr->wasFoundInTLB
 * - mr->physicalAddress
 * 
 * Vous devez également mettre à jour les timestamps dans le TLB et la table
 * de pages.
 */
void lookupInTLB(struct paging_system_state *ms,
                 struct memory_request *mr) {
    // TODO
    mr->wasFoundInTLB = 0;   
    unsigned long pageNumber = getPageNumber(mr->virtualAddr);
    unsigned long offset = getPageOffset(mr->virtualAddr);
    for (int i = 0; i < 32; i++) {
        if(ms->tlb->pageNumbers[i] == pageNumber){
            mr->wasFoundInTLB = 1;
            ms->tlb->lastAccessTimestamps[i] = mr->timestamp;   
            unsigned long positionDansMem = ms->tlb->frameNumbers[i];
            ms->mem->lastAccessTimestamps[positionDansMem] = mr->timestamp;
            unsigned long startAddr = getStartPageAddress(positionDansMem);
            mr->physicalAddr = 0x60c00 + startAddr + offset;
            break;
            // avec l'exemple du ppt : on veut changer le #page A en l'incrémentant
            // cela ne se fait que en additionnant à sa position. On ne peut pas 
            // juste faire +1 car on va incrémenter le offset C qui ne doit pas changer
        }
    }
   
}

/*
 * Cherche la traduction de l'adresse virtuelle dans la table de pages.
 * 
 * Si la traduction est trouvée dans la table de pages, modifier le champ:
 * - mr->physicalAddress
 * 
 * Sinon, modifier le champ:
 * - mr->wasPageFault
 * 
 * Vous devez également mettre à jour les timestamps dans la mémoire centrale.
 */
void lookupInPT(struct paging_system_state *ms,
                struct memory_request *mr) {
    // TODO
    unsigned long pageNumber = getPageNumber(mr->virtualAddr);
     unsigned long offset = getPageOffset(mr->virtualAddr);
    if(ms->pt->isValid[pageNumber] == 1){
        mr->wasPageFault = 0;
        unsigned long positionDansMem = ms->pt->frameNumbers[pageNumber];
        unsigned long startAddr = getStartPageAddress(positionDansMem);
        mr->physicalAddr = 0x60c00 + startAddr + offset;
        ms->mem->lastAccessTimestamps[positionDansMem] = mr->timestamp;
    }

    else
        mr->wasPageFault = 1;
}

/*
 * Ajoute la traduction de l'adresse virtuelle dans le TLB.
 * 
 * Si le TLB est plein, vous devez prendre en compte la politique de
 * remplacement du TLB pour modifier les champs:
 * - mr->wasEvictionInTLB
 * - mr->virtualAddrEvictedFromTLB
 * 
 * N'oubliez pas d'initialiser correctement le timestamp de votre nouvelle
 * entrée dans le TLB.
 * 
 * Attention: Si une page X est retirée de la mémoire où elle est remplacée par
 * une page Y, alors le TLB est mis à jour pour remplacer X par Y.
 */
void addToTLB(struct paging_system_state *ms,
              struct memory_request *mr) {
    // TODO
    // fifo en tlb
    int positionDansTlb = 0;
    if(ms->tlb->isUsed[31] == '1') {
        unsigned long min = ms->tlb->lastAccessTimestamps[0];
        for (int i = 0; i < 32; i++) {
            if(ms->tlb->lastAccessTimestamps[i] < min) {
                min = ms->tlb->lastAccessTimestamps[i];
                positionDansTlb = i;
            }
        }
    mr->wasEvictionInTLB = 1;
    mr->virtualAddrEvictedFromTLB = getStartPageAddress(ms->tlb->pageNumbers[positionDansTlb]);
    }
    else {
        for(int i = 0; i < 32; i++) {
            if(ms->tlb->isUsed[i] == '0') {
                positionDansTlb = i;
                ms->tlb->isUsed[i] = '1';
                break;
            }
        }
    }
    
    ms->tlb->entryCreationTimestamps[positionDansTlb] = mr->timestamp;
    unsigned long pageNumber = getPageNumber(mr->virtualAddr);
    ms->tlb->pageNumbers[positionDansTlb] = pageNumber;
    ms->tlb->frameNumbers[positionDansTlb] = ms->pt->frameNumbers[pageNumber];
    ms->tlb->lastAccessTimestamps[positionDansTlb] = mr->timestamp;
}

/*
 * Si cette fonction est appelée en dernier recours, cela signifie que la page
 * demandée n'est même pas présente en mémoire. Il faut donc l'amener en
 * mémoire puis ajouter la traduction dans la table de pages.
 * 
 * Si la mémoire est pleine, vous devez prendre en compte la politique de
 * remplacement de la mémoire pour modifier les champs:
 * - mr->wasEvictionInMemory
 * - mr->virtualAddrEvictedFromMemory
 * 
 * Dans tous les cas, vous devez modifier le champ:
 * - mr->physicalAddress
 */
void getPageIntoMemory(struct paging_system_state *ms,
                       struct memory_request *mr) {
    // TODO
    int positionDansMem = 0;
    if(ms->mem->isUsed[423] == 1) {
        unsigned long min = ms->mem->entryCreationTimestamps[0];
        for (int i = 0; i < 424; i++) {
            if(ms->mem->entryCreationTimestamps[i] < min) {
                min = ms->mem->entryCreationTimestamps[i];
                positionDansMem = i;
            } 
        }
        mr->wasEvictionInMemory = 1;
        mr->virtualAddrEvictedFromMemory = getStartPageAddress(ms->mem->pageNumbers[positionDansMem]);
    }
     else {
        for(int i = 0; i < 424; i++) {
            if(ms->mem->isUsed[i] == '0') {
                positionDansMem = i;
                ms->mem->isUsed[i] = '1';
                break;
            }
        }
    }
        unsigned long offset = getPageOffset(mr->virtualAddr);
        unsigned long startAddr = getStartPageAddress(positionDansMem);
        unsigned long pageNumber = getPageNumber(mr->virtualAddr);
        ms->mem->pageNumbers[positionDansMem] = pageNumber;
        ms->mem->lastAccessTimestamps[positionDansMem] = mr->timestamp;
        mr->physicalAddr = 0x60c00 + startAddr + offset;
        ms->pt->frameNumbers[pageNumber] = positionDansMem;
}

/*
 * Traite une demande d'accès à la mémoire.
 * 
 * Cette fonction mute les structures fournies en arguments pour modifier
 * l'état de la mémoire et donner des informations sur la demande d'accès en
 * argument (traduction en adresse physique, présence ou non de défaut de page,
 * présence ou non de la traduction dans le TLB...)
 * 
 * Arguments:
 * - un pointeur vers votre structure représentant l'état de la mémoire
 * - un pointeur vers une structure représentant la demande d'accès
 */
void processMemoryRequest(struct paging_system_state *ms,
                          struct memory_request *mr) {
    lookupInTLB(ms, mr);
    if (mr->wasFoundInTLB == 1)
    {
        return;
    }
    // tlb : 4
    // 7 pages
    // mmu : 10 
    /* Lookup in page table */
    lookupInPT(ms, mr);
    if (mr->wasPageFault == 0)
    {
        addToTLB(ms, mr);
        return;
    }
    /* Get frame in memory */
    getPageIntoMemory(ms, mr);
    addToTLB(ms, mr);
}

/*
 * Désalloue votre structure permettant de stocker l'état de la mémoire
 * 
 * Arguments:
 * - un pointeur vers votre structure stockant l'état de la mémoire
 */
void cleanMemoryState(struct paging_system_state *ms) {
    // TODO
    
    free(ms->pt->frameNumbers);
    free(ms->pt->isValid);
   
    free(ms->tlb->pageNumbers );
    free(ms->tlb->frameNumbers);
    free(ms->tlb->lastAccessTimestamps );
    free(ms->tlb->entryCreationTimestamps );
    free(ms->tlb->isUsed);
  
    free(ms->mem->pageNumbers);
    free(ms->mem->lastAccessTimestamps);
    free(ms->mem->entryCreationTimestamps);
    free(ms->mem->isUsed );

    free(ms->tlb);
    free(ms->pt);
    free(ms->mem);
}