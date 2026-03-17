//
//  Salaire.swift
//  iApsal
//
//  Created by Xav Boulot on 07/06/2023.
//
// Classe Salaire : contient tous les éléments du salaire
import Foundation

class Salaire {
    
    var iAnnee:Int = -1
    var iMois:Int = -1
    var dHMC:Double = 0
    var iCotis:Int = -1
    var dBrut:Double = 0
    var dNet:Double = 0
    var dAvNat:Double = 0
    var dDeduc:Double = 0
    var iclasse:Int = -1
    var dimposable:Double = 0
    var iTxImpot:Int = -1
    var swTxImpots:Bool = false
    var dTxImpot:Double = 0
    var bCalculCI:Bool = false
    var bCalculCIM:Bool = false
    var iMutualite:Int = 1
    var dTxSAT:Double = 0
    var dTxASAC:Double = 0
    var iBonus:Int = 1
    var dTxCMP:Double = 0
   //var dCotis:Double = 0
    var dCotisCMS:Double = 0
    var dCotisCME:Double = 0
    var dCotisCMP:Double = 0
    var dCotisSurprime:Double = 0
    var dCotisDep:Double = 0
    //var dCotisPatr:Double = 0
    var dCotisSecuPatr:Double = 0
    var dCotisMutuPatr:Double = 0
    var dCotisASACPatr:Double = 0
    var dCotisSATPatr:Double = 0
    var dCoutTotPatr:Double = 0
    
    var dImpot:Double = 0
    var dImpotEQBT:Double = 0
    var dCI:Double = 0
    var dCIM:Double = 0
    var dCICO2:Double = 0
    var dCIC:Double = 0
    var dCIE:Double = 0
    var dCISSM:Double = 0
    
    
    init() {
        self.iAnnee = -1
        self.dHMC = 0
        self.dimposable = 0
        self.iclasse = -1
        self.iMutualite = 1
        self.iBonus = 1
        self.dBrut = 0
        self.dAvNat = 0
        self.dDeduc = 0
        self.dCI = 0
        self.dCICO2 = 0
        self.dCIE = 0
        self.dCIC = 0
        self.dCISSM = 0
        self.dNet = 0
        //self.dCotis = 0
        self.dCotisCMS = 0
        self.dCotisCME = 0
        self.dTxCMP = 0
        self.dCotisCMP = 0
        self.dCotisSurprime = 0
        self.dCotisDep = 0
        self.dImpot = 0
        self.dTxImpot = 0
        self.swTxImpots = false
        self.dImpotEQBT = 0
        //self.dCotisPatr = 0
        self.dCotisSecuPatr = 0
        self.dCotisMutuPatr = 0
        self.dCotisASACPatr = 0
        self.dCotisSATPatr = 0
        self.dTxSAT = 0
        self.dTxASAC = 0
        self.dCoutTotPatr = 0
        self.iCotis = -1
        self.iTxImpot = -1
        self.bCalculCI = false
        self.bCalculCIM = false
    }
    
    //retourne les parts salariales
    func TotalBrut() -> Double {
        return dBrut+dAvNat
    }
    //retourne les parts salariales
    func PartsTrav() -> Double {
        return dCotisCMS+dCotisCME+dCotisCMP
    }
    //retourn les parts patronales
    func PartsPtronales() -> Double {
        return dCotisCMS+dCotisCME+dCotisCMP+dCotisSecuPatr+dCotisMutuPatr+dCotisASACPatr+dCotisSATPatr
    }
    //retourn le cout patron : brut + cotis
    func CoutPtronales() -> Double {
        return dBrut+dCotisCMS+dCotisCME+dCotisCMP+dCotisSecuPatr+dCotisMutuPatr+dCotisASACPatr+dCotisSATPatr
    }
}
