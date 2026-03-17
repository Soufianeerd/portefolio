//
//  CalculSalaire.swift
//  iApsal
//
//  Created by Xav Boulot on 12/05/2023.
//
// Procédures de calcul du salaire
//
/******************************************************************************/
import Foundation

class CalculSalaire {

    //Fonction de calcul
    func CalculSalaire(voSalaire:Salaire) -> Bool {

        //Définition des paramètres cotisations;
        let CMS:Double = 0.028
        let CME:Double = 0.0025
        var CMP:Double = 0.08
        let CDEP:Double = 0.014
        //var IMPIQBT:Double = 0.0
        var PlafondSecu:Double = 12541.18
        //var Minimum:Double = 2508.24
        
        //Parts Patronales
        
        let SAT:Double = 0.0011
        var ASAC:Double = 0.0100
        // Mutualité
        var Mutu1:Double = 0.0051
        var Mutu2:Double = 0.0123
        var Mutu3:Double = 0.0183
        var Mutu4:Double = 0.0292
        
        switch (voSalaire.iAnnee) {
        case 2026:
            ASAC = 0.0070
            // Mutualité
            Mutu1 = 0.0070
            Mutu2 = 0.0099
            Mutu3 = 0.0148
            Mutu4 = 0.0264
            PlafondSecu = 13518.68
            CMP = 0.085
            
        case 2025:
            ASAC = 0.0070
            // Mutualité
            Mutu1 = 0.0070
            Mutu2 = 0.0099
            Mutu3 = 0.0148
            Mutu4 = 0.0264
            PlafondSecu = 13518.68
        case 2024:
            ASAC = 0.0075
            // Mutualité
            Mutu1 = 0.0072
            Mutu2 = 0.0122
            Mutu3 = 0.0176
            Mutu4 = 0.0284
            PlafondSecu = 12854.64
            
        case 2023:
            //IMPIQBT = 0.0
            //Minimum = 2508.24
            PlafondSecu = 12541.18
            ASAC = 0.0075
            // Mutualité
            Mutu1 = 0.0072
            Mutu2 = 0.0122
            Mutu3 = 0.0176
            Mutu4 = 0.0284
            switch (voSalaire.iMois) {
            case 4:
                    PlafondSecu = 12541.18
            case 9:
                    PlafondSecu = 12854.64
            default:
                PlafondSecu = 12854.64
            }
        case 2022:
            //IMPIQBT = 0.0
            //Minimum = 2071.10
            PlafondSecu = 10355.50
            ASAC = 0.0075
            // Mutualité
            Mutu1 = 0.0060
            Mutu2 = 0.0113
            Mutu3 = 0.0166
            Mutu4 = 0.0298
            
        default:
            //IMPIQBT = 0.0
            //Minimum = 2071.10
            PlafondSecu = 10355.50
            ASAC = 0.0080
            // Mutualité
            Mutu1 = 0.0041
            Mutu2 = 0.0107
            Mutu3 = 0.0163
            Mutu4 = 0.0279
        }
        
        //double Cotis =0;
        //voSalaire.dCotis=0
        //voSalaire.dCotisPatr=0
        voSalaire.dCotisSecuPatr=0
        voSalaire.dCotisMutuPatr=0
        voSalaire.dCotisASACPatr=0
        voSalaire.dCotisSATPatr=0
        
        //mise en mémoire du tx de pension pour affichage
        voSalaire.dTxCMP = CMP * 100
        
        // Mettre 173 par défaut si pas de saisie de l'utilisateur
        if voSalaire.dHMC == 0 { voSalaire.dHMC = 173.0}
        
        //Calcul des cotisations
        
        
        //************* Cotisable *********************
        var cotisable:Double = (voSalaire.dBrut + voSalaire.dAvNat)
        if (cotisable > PlafondSecu) {
            cotisable=PlafondSecu
        }
        
        //************* Parts Salariales *********************
        // **** CMS ****
        voSalaire.dCotisCMS = CalculCotis(dMntCotisable: cotisable, Taux: CMS)
        
        //var iTemp:Int = Int((cotisable * CMS) * 1000)
        //var dTemp:Double = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        //voSalaire.dCotisCMS=dTemp
        
        //voSalaire.dCotis = voSalaire.dCotis + dTemp
        //voSalaire.dCotisSecuPatr = voSalaire.dCotisSecuPatr + dTemp
        //voSalaire.dCotisPatr = voSalaire.dCotisPatr + dTemp
        
        // **** CME ****
     
        var cotis_CME:Double = myRound(dbVal:voSalaire.dBrut ,nPlaces:2)
        if (cotis_CME > PlafondSecu) {
            cotis_CME=PlafondSecu
        }
        voSalaire.dCotisCME = CalculCotis(dMntCotisable: cotis_CME, Taux: CME)
        /*
        iTemp = Int((cotis_CME * CME) * 1000)
        dTemp = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        voSalaire.dCotisCME=dTemp
        //voSalaire.dCotis = voSalaire.dCotis + dTemp
       // voSalaire.dCotisSecuPatr = voSalaire.dCotisSecuPatr + dTemp
       // voSalaire.dCotisPatr = voSalaire.dCotisPatr + dTemp
        */
        
        // **** CMP ****
        voSalaire.dCotisCMP = CalculCotis(dMntCotisable: cotisable, Taux: CMP)
        /*
        iTemp = Int((cotisable * CMP) * 1000)
        dTemp = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        voSalaire.dCotisCMP=dTemp
        //voSalaire.dCotis = voSalaire.dCotis + dTemp
        //voSalaire.dCotisSecuPatr = voSalaire.dCotisSecuPatr + dTemp
        //voSalaire.dCotisPatr=voSalaire.dCotisPatr+dTemp
        */
        
        voSalaire.dHMC = myRound(dbVal:voSalaire.dHMC,nPlaces:0)
        var iTemp:Int = 0
        //Calcul de la cotisation dépendance
        iTemp = Int((PlafondSecu/20) * 1000)
        var dDeducDep:Double = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        iTemp = Int(((dDeducDep * voSalaire.dHMC) / 173) * 1000)
        dDeducDep = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        
        iTemp = Int((((voSalaire.dBrut + voSalaire.dAvNat)-dDeducDep) * CDEP) * 1000)
        voSalaire.dCotisDep = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        
        
        //************* Parts Patronales *********************
        //Cotisation patronale santé au travail
        // **** SAT ****
        voSalaire.dCotisSATPatr = CalculCotis(dMntCotisable: cotisable, Taux: SAT)
        
        /*iTemp = Int((cotisable * SAT) * 1000)
        dTemp = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        //voSalaire.dCotisPatr=voSalaire.dCotisPatr+dTemp         */
       //voSalaire.dCotisSATPatr=voSalaire.dCotisSATPatr+dTemp
        
        //Cotisation patronale Assurance Accident
        voSalaire.dCotisASACPatr = CalculCotis(dMntCotisable: cotisable, Taux: ASAC)
        
      /* iTemp = Int((cotisable * ASAC) * 1000)
        dTemp = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        //voSalaire.dCotisPatr=voSalaire.dCotisPatr+dTemp
        voSalaire.dCotisASACPatr=voSalaire.dCotisASACPatr+dTemp*/
        
        //Mutualité
        var txMutu:Double = 0
        switch (voSalaire.iMutualite + 1) {
            case 1:
                txMutu = Mutu1;
                break
            case 2:
                txMutu = Mutu2;
                break
            case 3:
                txMutu = Mutu3;
                break
            case 4:
                txMutu = Mutu4;
                break
            default:
                break
        }
        voSalaire.dCotisMutuPatr = CalculCotis(dMntCotisable: cotisable, Taux: txMutu)
        
       /* iTemp = Int((cotisable * txMutu) * 1000)
        dTemp = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        //voSalaire.dCotisPatr = voSalaire.dCotisPatr + dTemp
        voSalaire.dCotisMutuPatr = voSalaire.dCotisMutuPatr + dTemp
        */
        
        //voSalaire.dCoutTotPatr = voSalaire.dCotisPatr + voSalaire.dBrut
        // déclaration de la classe CalculImpot
        let monCalculImpot = Impots()
        //classe impôt
        monCalculImpot.classe = voSalaire.iclasse
        // rensegnement de l'imposable
        monCalculImpot.imposable = voSalaire.dBrut + voSalaire.dAvNat - voSalaire.PartsTrav() - voSalaire.dDeduc
        voSalaire.dimposable = monCalculImpot.imposable
        monCalculImpot.iAnnee = voSalaire.iAnnee
        
        //************* Impots **************
        switch voSalaire.swTxImpots {
        case false:
            //Calcul de l'impot
            if (monCalculImpot.CalculImpot())
            {
                voSalaire.dImpot =  monCalculImpot.impot
                
            }
            break
        case true:
            iTemp = Int(voSalaire.dimposable * voSalaire.dTxImpot)
            let dTemp:Double = myRound(dbVal:Double(iTemp) / 100,nPlaces:2)
            //Arrondir au multiple inférieur de 10 cent
            var dTemp3:Double = 0
            dTemp3 = floor((dTemp * 10) + 0.0001) / 10
            voSalaire.dImpot = dTemp3
            break
        }
        
        //**************************
        // Calcul du CISSM
        voSalaire.dCISSM =  CalculCISSM(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat, dHMC: voSalaire.dHMC, Annee: voSalaire.iAnnee, Mois: voSalaire.iMois)
                        
        //************* Crédit d'impôt ************
        switch voSalaire.bCalculCI
        {
            case false:
                //Cotis = cotisable * 0.1095;
                voSalaire.dCI = 0
            break
            case true:
                voSalaire.dCI =  CalculCI(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat, Annee: voSalaire.iAnnee)
            if voSalaire.iAnnee >= 2024
            {
                voSalaire.dCICO2 =  CalculCICO2(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat, Annee: voSalaire.iAnnee)
            }
          
            //************* CIC *********************
            if voSalaire.iAnnee < 2024 {
                if voSalaire.iAnnee == 2023 && voSalaire.iMois >= 6 {
                    voSalaire.dCIC =  CalculCIC(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat)
                }
            }
        }
        //CIE arrêté fin mars 2023
        if voSalaire.iAnnee == 2023 && voSalaire.iMois < 4
        {
            voSalaire.dCIE = CalculCIE(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat)
        }
        
        //*************
        // Calcul du total
        voSalaire.dNet = voSalaire.dBrut-voSalaire.dImpot
        // Calcul du net
        let dResNet:Double = voSalaire.dBrut - voSalaire.PartsTrav() - voSalaire.dCotisDep -  voSalaire.dImpot + voSalaire.dCI + voSalaire.dCICO2 + voSalaire.dCIC + voSalaire.dCISSM
        
        //*************
        //Calcul du Net
        iTemp = Int(dResNet * 1000)
        voSalaire.dNet = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        //*************
        
      
    return true
    }
    
    func CalculCotis(dMntCotisable:Double, Taux:Double) -> Double {
        //var mntCotis: Double = 0
        let iTemp:Int = Int((dMntCotisable * Taux) * 1000)
        let dTemp:Double = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        
       //voSalaire.dCotisCME=dTemp
        return dTemp
    }
    //**************************
    // Calcul du CISSM
    func CalculCISSM(dMntBrut:Double, dHMC:Double, Annee:Int, Mois:Int) -> Double {
        var mntCISSM: Double = 0
        
       // var iTemp:Int = Int((dMntBrut / dHMC) * HMC_Secu(Annee:2023, Mois:11)) * 1000
        let iTemp:Int = Int((dMntBrut / dHMC) * Double(HMC_Secu(Annee: Annee,Mois: Mois))) * 1000
        let dMntBrutCISSM:Double = myRound(dbVal:Double(iTemp) / 1000,nPlaces:2)
        
        if (dMntBrutCISSM >= 1800.0 && dMntBrutCISSM < 3000.0)
        {
            mntCISSM = 70.00
        }
        else {
            if (dMntBrutCISSM >= 3000.0 && dMntBrutCISSM <= 3600.0)
            {
                //   dTemp =3000 - dtempCISM;
                mntCISSM = (70 / 600) * ( 3600 - dMntBrutCISSM)
                //arroni au cent supérieur
                var ddd:Double = 0
                ddd = ceil(mntCISSM * 100) / 100
                mntCISSM = ddd
               
                if (mntCISSM > 70)
                    {
                    mntCISSM = 70
                    }
                }
            else {
                mntCISSM = 0
            }
        }
        return mntCISSM
    }
    
    //**************************
    // Calcul du CI-CO2
    func CalculCICO2(dMntBrut:Double, Annee:Int) -> Double {
        
        var mntCICO2: Double = 0
        let dTemp: Double = (dMntBrut * 12)
        if Annee >= 2026 {
            if (dTemp < 936)
            {
                mntCICO2=0;
            }
            else
            {
                if (dTemp < 40000)
                {
                    mntCICO2 = 18;
                }
                else
                {
                    if (dTemp < 80000)
                    {
                        mntCICO2 = (216 - (dTemp - 40000) * 0.0054) / 12
                    }
                    else
                    {
                        mntCICO2 = 0 ;
                    }
                }
            }
        }
        else
        {
            if Annee == 2025 {
                if (dTemp < 936)
                {
                    mntCICO2=0;
                }
                else
                {
                    if (dTemp < 40000)
                    {
                        mntCICO2 = 16;
                    }
                    else
                    {
                        if (dTemp < 80000)
                        {
                            mntCICO2 = (192 - (dTemp - 40000) * 0.0048) / 12
                        }
                        else
                        {
                            mntCICO2 = 0 ;
                        }
                    }
                }
            }
            else
            {
                if Annee == 2024 {
                    if (dTemp < 936)
                    {
                        mntCICO2=0;
                    }
                    else
                    {
                        if (dTemp < 40000)
                        {
                            mntCICO2 = 14;
                        }
                        else
                        {
                            if (dTemp < 80000)
                            {
                                mntCICO2 = (168 - (dTemp - 40000) * 0.0042) / 12
                            }
                            else
                            {
                                mntCICO2 = 0 ;
                            }
                        }
                    }
                }
                else
                {
                    if (dTemp < 936)
                    {
                        mntCICO2=0;
                    }
                    else
                    {
                        if (dTemp < 40000)
                        {
                            mntCICO2 = 12;
                        }
                        else
                        {
                            if (dTemp < 80000)
                            {
                                mntCICO2 = (144 - (dTemp - 40000) * 0.0036) / 12
                            }
                            else
                            {
                                mntCICO2 = 0 ;
                            }
                        }
                    }
                }
            }
        }
        
        let clsMaths = clsMaths()
        return  clsMaths.RoundUP(dbVal: mntCICO2, Decplace: 2)
     
    }
    
    //**************************
    // Calcul du CI
    func CalculCI(dMntBrut:Double, Annee:Int) -> Double {
        var mntCI: Double = 0
        
        //let dTemp: Double = myRound(dbVal: Double(dMntBrut) * 12, nPlaces:2)
        if  Annee >= 2026 {
            let dTemp: Double = (dMntBrut * 12)
            if (dTemp < 936)
            {
                mntCI=0;
            }
            else
            {
                if (dTemp < 11266)
                {
                    mntCI = (300 + (dTemp - 936 ) * 0.029) / 12
                }
                else
                {
                    if (dTemp < 40000)
                    {
                        mntCI = 50;
                    }
                    else
                    {
                        if (dTemp < 80000)
                        {
                            mntCI = (600 - (dTemp - 40000) * 0.015) / 12
                        }
                        else
                        {
                            mntCI = 0 ;
                        }
                    }
                }
            }
        }
        else
        {
            if  Annee == 2025 {
                let dTemp: Double = (dMntBrut * 12)
                if (dTemp < 936)
                {
                    mntCI=0;
                }
                else
                {
                    if (dTemp < 11266)
                    {
                        mntCI = (300 + (dTemp - 936 ) * 0.029) / 12
                    }
                    else
                    {
                        if (dTemp < 40000)
                        {
                            mntCI = 50;
                        }
                        else
                        {
                            if (dTemp < 80000)
                            {
                                mntCI = (600 - (dTemp - 40000) * 0.015) / 12
                            }
                            else
                            {
                                mntCI = 0 ;
                            }
                        }
                    }
                }
            }
            else
            {
                if  Annee == 2024 {
                    let dTemp: Double = (dMntBrut * 12)
                    if (dTemp < 936)
                    {
                        mntCI=0;
                    }
                    else
                    {
                        if (dTemp < 11266)
                        {
                            mntCI = (300 + (dTemp - 936 ) * 0.029) / 12
                        }
                        else
                        {
                            if (dTemp < 40000)
                            {
                                mntCI = 50;
                            }
                            else
                            {
                                if (dTemp < 80000)
                                {
                                    mntCI = (600 - (dTemp - 40000) * 0.015) / 12
                                }
                                else
                                {
                                    mntCI = 0 ;
                                }
                            }
                        }
                    }
                }
                else
                {
                    let dTemp: Double = (dMntBrut * 12)
                    if (dTemp < 936)
                    {
                        mntCI=0;
                    }
                    else
                    {
                        if (dTemp < 11266)
                        {
                            mntCI = (396 + (dTemp - 936 ) * 0.029) / 12
                        }
                        else
                        {
                            if (dTemp < 40000)
                            {
                                mntCI = 58;
                            }
                            else
                            {
                                if (dTemp < 80000)
                                {
                                    mntCI = (696 - (dTemp - 40000) * 0.0174) / 12
                                }
                                else
                                {
                                    mntCI = 0 ;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        let clsMaths = clsMaths()
       // fgg.Round(dbVal: DoublemntCI, Decplace: 2)
       
        return  clsMaths.RoundUP(dbVal: mntCI, Decplace: 2)
        
    }
    
    //**************************
    // Calcul du CIC
    func CalculCIC(dMntBrut:Double) -> Double {
        let clsMaths = clsMaths()
        var mntCIC: Double = 0
        
        if dMntBrut < 1125
            { mntCIC = 0 }
        else if dMntBrut <= 1250
            { mntCIC = (dMntBrut - 1125) * (4 / 125) }
        else if dMntBrut <= 2100
            { mntCIC = ((dMntBrut - 1250) * (3 / 850)) + 4 }
        else if dMntBrut <= 4600
            { mntCIC = ((dMntBrut - 2100) * (37 / 2500)) + 7}
        else if dMntBrut <= 9500
            { mntCIC = 44 }
        else if dMntBrut <= 9925
            { mntCIC = ((dMntBrut - 9500) * (4 / 425)) + 44}
        else if dMntBrut <= 14175
            { mntCIC = 48 }
        else if dMntBrut <= 14916
            { mntCIC = ((dMntBrut - 14175) * (3 / 356)) + 48 }
        else {mntCIC = 54.25}
            
        return  clsMaths.RoundUP(dbVal: mntCIC, Decplace: 2)
        
    }
    
    //**************************
    // Calcul du CIE
    func CalculCIE(dMntBrut:Double) -> Double {
        
        var mntCIE: Double = 0
        // si < 79 ou > 8333 lors 0
        if (dMntBrut < 79 || dMntBrut > 8333)
        {
            mntCIE=0;
        }
        else
        {
                if (dMntBrut < 3667)
                {
                    mntCIE = 84;
                }
                else
                {
                    if (dMntBrut < 5667)
                    {
                        mntCIE = (84 - ((dMntBrut - 3667) * (8 / 2000)))
                    }
                    else
                    {
                        if (dMntBrut < 8334)
                        {
                            mntCIE = (76 - ((dMntBrut - 5667) * (76 / 2667)))
                        }
                        else
                        {
                            mntCIE = 0 ;
                        }
                    }
                }
        }
        
        let clsMaths = clsMaths()
        return  clsMaths.RoundUP(dbVal: mntCIE, Decplace: 2)
     
    }
    
    // ***********************************
    // Calcul des heures mois complet sécu
    // (jours du mois - les samedi et dimanche) * 8
    // ***********************************
    func HMC_Secu(Annee:Int, Mois:Int) -> Int
    {
        // choose the month and year you want to look
        let gregorianCalendar = NSCalendar(calendarIdentifier: .gregorian)!
        var dateComponents = DateComponents()
        dateComponents.year = Annee
        dateComponents.month = Mois

        let calendar = Calendar.current
        let datez = calendar.date(from: dateComponents)
        // change .month into .year to see the days available in the year
        let interval = calendar.dateInterval(of: .month, for: datez!)!

        let days = calendar.dateComponents([.day], from: interval.start, to: interval.end).day!
        var lhmc:Int = 0
        //Boucle sur les jours du mois pour compter les jours ouvrés (Lundi au Vendredi)
        for i in 1 ... days
        {
           dateComponents.day = i

            let date = gregorianCalendar.date(from: dateComponents)!
            let myComponents = calendar.component(.weekday, from: date)
            
            let weekDay = myComponents.description
                switch weekDay 
            {
                case "2": //Lundi
                    lhmc = lhmc + 1;
                case "3": //Mardi
                    lhmc = lhmc + 1;
                case "4": //Mercredi
                    lhmc = lhmc + 1;
                case "5": //Jeudi
                   lhmc = lhmc + 1;
                case "6": //Vendredi
                   lhmc = lhmc + 1;
                default:
                    lhmc = lhmc + 0;
            }
        }
        
        return lhmc * 8
    }
    
    //*************
    //Function round
    func myRound(dbVal:Double, nPlaces:Int) -> Double    {
        let dbShift:Decimal = pow(10.0,nPlaces)
       
        let temp:Double = Double(dbShift.description) ?? 0
        
        return floor(dbVal * temp + 0.5) / temp
    }
}
