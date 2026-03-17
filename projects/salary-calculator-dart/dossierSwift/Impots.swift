//
//  Impots.swift
//  iApsal
//
//  Created by Xav Boulot on 12/04/2023.
//
// Calcul de l'impôt
/******************************************************************************/
import Foundation

class Impots {
    
    var iAnnee:Int = -1
    var imposable:Double = 0
    var classe:Int = -1
    var joursimpot:Int = -1
    var impot:Double = 0
    
    func CalculImpot() -> Bool {
        
        switch (iAnnee) {
            case 2025, 2026:
                impot = CalculImpot2025(parimposable: imposable, parclasse: classe)
            case 2024:
                impot = CalculImpot2024(parimposable: imposable, parclasse: classe)
            case 2022:
                impot = CalculImpot2017(parimposable: imposable, parclasse: classe)
            
            default: //2017 -
                impot = CalculImpot2017(parimposable: imposable, parclasse: classe)
                       }
        return true
    }
    //Calcul impot 2025 --> now
    func CalculImpot2025(parimposable:Double, parclasse:Int) -> Double {
        
        var dImpot:Double = 0
        
        var txSolid:Double = 1.04
        var deducSolid:Double = 0
        var temp1:Double = 0
        var temp2:Double = 0
        var mntentier:Double = 0
        var mntentier1:Double = 0
        var iTemp:Double = 0
        var dTemp:Double = 0
        var iTemp3:Double = 0
        
        //Arrondi 5 euro <
        mntentier1 = floor(parimposable) // (int)Math.Truncate(imposable;
        
        temp1 = floor((mntentier1 + 5.0001)/10)
        temp2 = floor((mntentier1 + 0.0001)/10)
        
        mntentier=0;
        
        if ((temp1-temp2)>0) {
            mntentier = (floor(mntentier1/10)*10)+5
        } else {
            mntentier = (floor(mntentier1/10)*10)
        }
        
        //Déclaration de la classe Baremeimpot
        
        let monBareme = baremeImpot()
        
        monBareme.classe=parclasse;
        monBareme.mntimposable=mntentier;
        //Recherche des données
        if (monBareme.Bareme2025())
        {
            //Calcul de l'impot
            dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible
            //arroni au cent inférieur
            dTemp = floor((dImpot * 10) + 0.0001)/10
            dImpot = dTemp;
            
            //ajout du taux de solidarité + arroni au cent inférieur
            txSolid = 1.07
            deducSolid = 0
            
            switch parclasse {
            case 100:
                if (mntentier > 12585)
                {
                    txSolid = 1.09
                    deducSolid = 77.65
                }
                
            case 200:
                if (mntentier > 25085)
                {
                    txSolid = 1.09
                    deducSolid = 155.30
                }
                
            case  300:
                if (mntentier > 12585 )
                {
                    txSolid = 1.09
                    deducSolid = 73.78
                }
            default:
                txSolid = 1.07
                deducSolid = 0
            }
            
            iTemp = ((dImpot * txSolid) * 1000)
            iTemp3 = iTemp / 1000
            dImpot = iTemp3 - deducSolid
            iTemp3 = floor((dImpot * 10) + 0.0001) / 10
            dImpot = iTemp3
            
        }
        return dImpot
    }
    //Calcul impot 2024 --> now
    func CalculImpot2024(parimposable:Double, parclasse:Int) -> Double {
        
        var dImpot:Double = 0
        
        var txSolid:Double = 1.04
        var deducSolid:Double = 0
        var temp1:Double = 0
        var temp2:Double = 0
        var mntentier:Double = 0
        var mntentier1:Double = 0
        var iTemp:Double = 0
        var dTemp:Double = 0
        var iTemp3:Double = 0
        
        //Arrondi 5 euro <
        mntentier1 = floor(parimposable) // (int)Math.Truncate(imposable;
        
        temp1 = floor((mntentier1 + 5.0001)/10)
        temp2 = floor((mntentier1 + 0.0001)/10)
        
        mntentier=0;
        
        if ((temp1-temp2)>0) {
            mntentier = (floor(mntentier1/10)*10)+5
        } else {
            mntentier = (floor(mntentier1/10)*10)
        }
        
        //Déclaration de la classe Baremeimpot
        
        let monBareme = baremeImpot()
        
        monBareme.classe=parclasse;
        monBareme.mntimposable=mntentier;
        //Recherche des données
        if (monBareme.Bareme2024())
        {
            //Calcul de l'impot
            dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible
            //arroni au cent inférieur
            dTemp = floor((dImpot * 10) + 0.0001)/10
            dImpot = dTemp;
            
            //ajout du taux de solidarité + arroni au cent inférieur
            txSolid = 1.07
            deducSolid = 0
            
            switch parclasse {
            case 100:
                if (mntentier > 12585)
                {
                    txSolid = 1.09
                    deducSolid = 79.014
                }
                
            case 200:
                if (mntentier > 25085)
                {
                    txSolid = 1.09
                    deducSolid = 158.028
                }
                
            case  300:
                if (mntentier > 12585 )
                {
                    txSolid = 1.09
                    deducSolid = 77.724
                }
            default:
                txSolid = 1.07
                deducSolid = 0
            }
            
            iTemp = ((dImpot * txSolid) * 1000)
            iTemp3 = iTemp / 1000
            dImpot = iTemp3 - deducSolid
            iTemp3 = floor((dImpot * 10) + 0.0001) / 10
            dImpot = iTemp3
            
        }
        return dImpot
    }
    
    //Calcul impot 2017 --> now
    func CalculImpot2017(parimposable:Double, parclasse:Int) -> Double {
        
        var dImpot:Double = 0
        
        var txSolid:Double = 1.04
        var deducSolid:Double = 0
        var temp1:Double = 0
        var temp2:Double = 0
        var mntentier:Double = 0
        var mntentier1:Double = 0
        var iTemp:Double = 0
        var dTemp:Double = 0
        var iTemp3:Double = 0
        
        //Arrondi 5 euro <
        mntentier1 = floor(parimposable) // (int)Math.Truncate(imposable;
        
        temp1 = floor((mntentier1 + 5.0001)/10)
        temp2 = floor((mntentier1 + 0.0001)/10)
        
        mntentier=0;
        
        if ((temp1-temp2)>0) {
            mntentier = (floor(mntentier1/10)*10)+5
        } else {
            mntentier = (floor(mntentier1/10)*10)
        }
        
        //Déclaration de la classe Baremeimpot
        
        let monBareme = baremeImpot()
        
        monBareme.classe=parclasse;
        monBareme.mntimposable=mntentier;
        //Recherche des données
        if (monBareme.Bareme2017())
        {
            //Calcul de l'impot
            dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible
            //arroni au cent inférieur
            dTemp = floor((dImpot * 10) + 0.0001)/10
            dImpot = dTemp;
            
            //ajout du taux de solidarité + arroni au cent inférieur
            txSolid = 1.07
            deducSolid = 0
            
            switch parclasse {
            case 100:
                if (mntentier > 12585)
                {
                    txSolid = 1.09
                    deducSolid = 81.010
                }
                
            case 200:
                if (mntentier > 25085)
                {
                    txSolid = 1.09
                    deducSolid = 162.022
                }
                
            case  300:
                if (mntentier > 12585 )
                {
                    txSolid = 1.09
                    deducSolid = 79.832
                }
            default:
                txSolid = 1.07
                deducSolid = 0
            }
            
            iTemp = ((dImpot * txSolid) * 1000)
            iTemp3 = iTemp / 1000
            dImpot = iTemp3 - deducSolid
            iTemp3 = floor((dImpot * 10) + 0.0001) / 10
            dImpot = iTemp3
            
        }
        return dImpot
    }
}
