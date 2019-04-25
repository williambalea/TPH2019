/*
 * Sync Lab - installer.c
 * 
 * Ecole polytechnique de Montreal, 2018
 */

#include "libsynclab.h"
#include "installer/libinstaller.h"

// TODO
// Si besoin, ajouter ici les directives d'inclusion
// -------------------------------------------------
#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>
#include <semaphore.h>
// -------------------------------------------------

// TODO
// Si besoin, définissez ici des types de structures et/ou
// des variables
// -------------------------------------------------------
struct threadArg {
    long packageNum;
    struct management_data* md;
    sem_t** sems;
};
// -------------------------------------------------------

void* clean(void* arg) {
    struct threadArg* newArg = (struct threadArg*)(arg);
    doPackageCleanup(newArg->packageNum, newArg->md);

    switch (newArg->packageNum) {
        case 9:
                pthread_cancel(newArg->md->tids[3]);
                pthread_cancel(newArg->md->tids[4]);
                pthread_cancel(newArg->md->tids[5]);
                break;
        case 8:
                pthread_cancel(newArg->md->tids[4]);
                break;
        case 7:
                pthread_cancel(newArg->md->tids[0]);
                pthread_cancel(newArg->md->tids[3]);
                pthread_cancel(newArg->md->tids[4]);
                break;
        case 6: 
                pthread_cancel(newArg->md->tids[1]);
                pthread_cancel(newArg->md->tids[4]);
                break;
        case 5:
                pthread_cancel(newArg->md->tids[0]);
                pthread_cancel(newArg->md->tids[1]);
                pthread_cancel(newArg->md->tids[2]);
                break;
        case 4:
        case 3: 
                pthread_cancel(newArg->md->tids[1]);
                pthread_cancel(newArg->md->tids[2]);
                break;
        case 2:
        case 1:
                pthread_cancel(newArg->md->tids[0]);
                break;
        default:
                break;

    }

    return NULL;
}

// TODO
// Si besoin, définissez ici des fonctions supplémentaires
// -------------------------------------------------------
void* threadWrapper(void* arg) {
    struct threadArg* newArg = (struct threadArg*)(arg);
    //pthread_cleanup_push(clean(newArg), NULL);
    threadedPackageInstaller(newArg->packageNum, newArg->md);
    //pthread_cleanup_pop(0);
    return NULL;
}
// -------------------------------------------------------

/*
 * Cette fonction alloue et initialise certains champs de la structure md qui
 * sont utilisés dans le reste des fonctions.
 */
void initializeManagementData(struct management_data *md) {
    // TODO (Q2, Q3)
    md->downloadSemaphore = malloc(sizeof(sem_t));
    
    sem_init(md->downloadSemaphore, 0, 4);
    for(int i = 0; i < 10; i++) {
        md->canInstallPackage[i] = malloc(sizeof(sem_t));
    switch (i) {
        case 6:
        case 7:
        case 8:
        case 9:
                sem_init(md->canInstallPackage[i], 0, 1);
                break;
        default:
                sem_init(md->canInstallPackage[i], 0, 0);
                break;
        }
    }
}

/*
 * Cette fonction nettoie les champs de la structure md qui ont été initialisés
 * par la fonction initializeManagementData.
 */
void cleanupManagementData(struct management_data *md) {
    // TODO (Q2, Q3)
    sem_destroy(md->downloadSemaphore);

}

/*
 * Cette fonction télécharge et installe le paquet logiciel dont le numéro est
 * passé en argument.
 */
void installPackage(int packageNum, struct management_data *md) {
    // TODO (Q2, Q3)
    char* packageName[10] = {
    "yoomp-5.3", "libnunkoond-5.7",
    "gosp-1.15","libtiwooft-7.15",
    "foochunt-9.7", "droct-0.18",
    "tug-1.4", "libbler-3.5",
    "prowem-0.18", "vol-3.14" };

    sem_wait(md->downloadSemaphore);
    doPackageDownload(packageName[packageNum], md);
    sem_post(md->downloadSemaphore);

    sem_wait(md->canInstallPackage[packageNum]);
    doPackageInstall(packageName[packageNum], md);

}

/*
 * Cette fonction vérifie si le paquet logiciel dont le numéro est passé en
 * argument est prêt pour l'installation. Si c'est le cas, la fonction débloque
 * le paquet pour que son installation puisse se lancer.
 * 
 * NOTE: Cette fonction vous aidera à clarifier votre code pour la fonction
 * postPackageInstall. Il est fortement recommandée de l'utiliser, mais ce
 * n'est pas obligatoire.
 */
void wakePackage(int wokenPackageNum, struct management_data *md) {
    // TODO (Q3)
    switch (wokenPackageNum) {
        case 9:
        case 8:
        case 7:
        case 6:
                sem_post(md->canInstallPackage[wokenPackageNum]);
                break;
        case 5:
            if( md->isPackageInstalled[9])
                sem_post(md->canInstallPackage[wokenPackageNum]);
            break;
        case 4:
            if( md->isPackageInstalled[9] && md->isPackageInstalled[8] &&
                md->isPackageInstalled[7] && md->isPackageInstalled[6]  )
                sem_post(md->canInstallPackage[wokenPackageNum]);
            break;
        case 3:
            if( md->isPackageInstalled[9] && md->isPackageInstalled[7] )
                sem_post(md->canInstallPackage[wokenPackageNum]);

            break;
        case 2:
            if( md->isPackageInstalled[5] && md->isPackageInstalled[4] &&
                md->isPackageInstalled[3])
                sem_post(md->canInstallPackage[wokenPackageNum]);
            break;
        case 1:
            if( md->isPackageInstalled[6] && md->isPackageInstalled[5] &&
                md->isPackageInstalled[4] && md->isPackageInstalled[3]  )
                sem_post(md->canInstallPackage[wokenPackageNum]);
            break;
        case 0:
            if( md->isPackageInstalled[7] && md->isPackageInstalled[5] &&
                md->isPackageInstalled[2] && md->isPackageInstalled[1]  )
                sem_post(md->canInstallPackage[wokenPackageNum]);
            break;

        default:
            break;

    }
}

/*
 * Cette fonction est exécutée après l'installation du paquet logiciel dont
 * le numéro est passé en argument. Son rôleF est de marquer le paquet comme
 * installé dans la structure md, et également de débloquer l'installation des
 * paquets logiciels qui pourraient désormais être prêts pour installation.
 * 
 * Afin de clarifier votre code, il est conseillé de compléter et d'utiliser la
 * fonction wakePackage définie juste au-dessus.
 * 
 * ATTENTION: Cette fonction est testée de manière unitaire par le script de
 * notation. Vous devez vous assurer qu'elle a bien le comportement décrit plus
 * haut et qu'elle ne modifie pas d'autres variables que celles stockées dans
 * la structure md.
 */

 // indice : le sémaphore md->canInstallPackage[i] ne peut avoir comme etat QUE
 // 1 (=le paquet peut s'installer) ou 0 (= le paquet ne peut pas s'installer)
 //void* threadedPackageInstaller(int packageNum, struct management_data *md);
void postPackageInstall(int packageNum, struct management_data *md) {
    // TODO (Q3)
    // md->threadedPackageInstaller(packageNum, md);
    md->isPackageInstalled[packageNum] = 1;
    for (int i = 0; i < 10; i++){
        wakePackage(i, md);
    }
}

/*
 * Cette fonction crée les dix fils d'exécution qui seront chargés de
 * l'installation des paquets logiciels.
 * Chaque fil d'exécution doit exécuter la fonction threadedPackageInstaller
 * en lui passant comme argument:
 * - le numéro du paquet logiciel à installer (compris entre 0 et 9)
 * - le pointeur md vers la structure passée en argument de la fonction
 *   installer
 */
void installer(struct management_data *md) {
    // NE PAS MODIFIER
    // --------------------------
    initializeManagementData(md);
    installerTestInit(md);
    // --------------------------

    // TODO (Q1)
    // Lancer les fils d'exécution
    // ---------------------------
    struct threadArg* tArgs[10];
    // pthread_mutex_t* mutex = malloc(sizeof(pthread_mutex_t));
    // pthread_mutex_init(mutex, NULL);
    for (long i = 0; i < 10; i++) {
        tArgs[i] = malloc(sizeof(struct threadArg));
        tArgs[i]->packageNum = i;
        tArgs[i]->md = md;
        pthread_create(&(md->tids[i]), NULL, threadWrapper, (void*)(tArgs[i]));
    }
    for (long i = 0; i < 10; i ++) {
        pthread_join(md->tids[i], NULL);
    }
    for (long i = 0; i < 10; i ++) {
        free(tArgs[i]);
    }
    // free(mutex);
    // ---------------------------

    // NE PAS MODIFIER
    // -----------------------
    cleanupManagementData(md);
    // -----------------------
}