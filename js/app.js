// console.log('JS Test')

const { createApp } = Vue

createApp({
    data() {
        return {
            // contenuto del titolo
            title: 'Calcolatore Straordinari',
            giornata: {
                data: '',
                turno: '',
                dalle: '',
                alle: '',
                straordinari: 0
            },
            tipoInsert: 'Standard',
            giorniInseriti: [],
            showAlert: false,
            alertMessage: ''
        }
    },


    computed: {
        // # Somma tutti gli straordinari dei  giorni inseriti e li converte in ore, ritornando le ore
        totaleStraordinari() {
            let sommaMinuti = 0
            this.giorniInseriti.forEach(giorno => {
                sommaMinuti = sommaMinuti + giorno.straordinari
            });
            const durata = moment.duration(sommaMinuti, 'minutes')
            const ore = Math.floor(durata.asHours());
            const minuti = durata.minutes();
            return `${ore} ore e ${minuti} minuti.`
        }
    },


    methods: {
        
        daMinutiAOre(min) {
            const durata = moment.duration(min, 'minutes')
            const ore = Math.floor(durata.asHours());
            const minuti = durata.minutes();
            return `${ore} h ${minuti} m.`
        },
        /**
         * Turno Mattino: dalle 7:00 alle 14:00 
         * Turno Pomeriggio: dalle 12:00 19:00
         * Prende l'orario di entrata, l'orario di uscita, e il turno di riferimento di un determinato giorno e calcola gli straordinari in base alle finestre di servizio.
         */
        calcolaStraordinario(start, end, turno) {
            let inizioTurno = null
            let fineTurno = null

            if (turno === 'Mattino') {
                inizioTurno = moment('7:00', 'HH:mm');
                fineTurno = moment('14:00', 'HH:mm');
            } else if (turno === 'Pomeriggio') {
                inizioTurno = moment('12:00', 'HH:mm');
                fineTurno = moment('19:00', 'HH:mm');
            } else {
                alert('Non dovrebbe mai entrare qui.')
                return 0
            }

            // Orario reale lavorato
            const orarioInizio = moment(start, 'HH:mm');
            const orarioFine = moment(end, 'HH:mm');

            let straordinario = 0;

            // Straordinario prima dell'inizio turno
            if (orarioInizio.isBefore(inizioTurno)) {
                straordinario += inizioTurno.diff(orarioInizio, 'minutes');
            }

            // Straordinario dopo la fine turno
            if (orarioFine.isAfter(fineTurno)) {
                straordinario += orarioFine.diff(fineTurno, 'minutes');
            }

            return straordinario;

        },
        /**
         * Date un orario di inizio ed un orario di fine
         * calcola il tempo trascorso dall'inizio alla fine,
         * ritorna un numero corrispondente al numero di minuti trascorsi.
         */
        calcolaStraordinarioExtra(start, end) {
            // Orario reale lavorato
            const orarioInizio = moment(start, 'HH:mm');
            const orarioFine = moment(end, 'HH:mm');

            const straordinario = orarioFine.diff(orarioInizio, 'minutes');

            return straordinario
        },

        inserisciData() {
            let dataOk = true
            let message = 'Non hai compilato i seguenti campi: '

            const data = this.giornata.data
            const turno = this.giornata.turno
            const dalle = this.giornata.dalle
            const alle = this.giornata.alle

            // # Controlli
            if (data === '' || turno === '' || dalle === '' || alle === '') {
                if (data === '') {
                    message += ' Data,'
                }
                if (turno === '') {
                    message += ' Turno,'
                }
                if (dalle === '') {
                    message += ' Dalle Ore,'
                }
                if (alle === '') {
                    message += ' Alle Ore,'
                }

                const errMsg = message.replace(/,\s*$/, '.');
                this.openAlert(errMsg);
            } else {
                if(this.tipoInsert === 'Standard') {
                    this.giornata.straordinari = this.calcolaStraordinario(dalle, alle, turno);
                } else {
                    this.giornata.straordinari = this.calcolaStraordinarioExtra(dalle, alle)
                    this.giornata.turno = this.giornata.turno + ' (Extra)'
                }

                this.giorniInseriti.push(JSON.parse(JSON.stringify(this.giornata)));
                this.resetGiornata();
            }

        },

        resetGiornata() {
            this.giornata.data = ''
            this.giornata.turno = ''
            this.giornata.dalle = ''
            this.giornata.alle = ''
            this.giornata.straordinari = 0
        },

        eliminaGiornata(index) {
            this.giorniInseriti.splice(index, 1);
        },

        openAlert(msg) {
            this.showAlert = true;
            this.alertMessage = msg;
        },

        closeAlert() {
            this.showAlert = false;
            this.alertMessage = ''
        }
    }
}).mount('#app')





