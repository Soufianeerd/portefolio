//
//  Calcul.swift
//  iApsal
//
//  Created by Xav Boulot on 30/05/2023.
//
// PRocédures gérant le calcul Brut Net et Net Brut
/******************************************************************************/

import Foundation

class Calcul {
    
    /******************************************************************************/
    // Calcyl Brut Net
    
    func CalculBrutNet(voSalaire:Salaire) -> Bool {
                 
        
        //******* Init classe CalculSalaire
        let lCalcul = CalculSalaire()
                
        //Calcul
        let lResult:Bool = lCalcul.CalculSalaire(voSalaire:voSalaire)
        // Si ok alors on retour true
        if lResult {
           
            return true
        }
        return false
    }
    
    /******************************************************************************/
    // Calcul Net Brut
    
    func CalculNetBrut(voSalaire:Salaire) -> Bool {
                      
        //init classe calcul salaire
        let lCalcul = CalculSalaire()
        //Calcul
        var NetRecherche:Double = voSalaire.dNet
        
        var dNet:Double = 0
        while (dNet < NetRecherche) {
            let lResult:Bool = lCalcul.CalculSalaire(voSalaire:voSalaire)
           
            if lResult {
                dNet = voSalaire.dNet
            if (dNet < NetRecherche) {

                if ((NetRecherche - dNet) > 10000000) {
                    voSalaire.dBrut = voSalaire.dBrut + 100000

                }   else {
                if ((NetRecherche - dNet) > 5000000) {
                    voSalaire.dBrut = voSalaire.dBrut + 500000

                }   else {  
                if ((NetRecherche - dNet) > 2000000) {
                    voSalaire.dBrut = voSalaire.dBrut + 2000000

                }   else {      
                if ((NetRecherche - dNet) > 1000000) {
                    voSalaire.dBrut = voSalaire.dBrut + 1000000
                    
                }   else {
                if ((NetRecherche - dNet) > 500000) {
                    voSalaire.dBrut = voSalaire.dBrut + 500000
                                    
                }   else {
                if ((NetRecherche - dNet) > 200000) {
                    voSalaire.dBrut = voSalaire.dBrut + 200000
                                        
                }   else {
                if ((NetRecherche - dNet) > 100000) {
                    voSalaire.dBrut = voSalaire.dBrut + 100000
                                            
                }   else {
                if ((NetRecherche - dNet) > 50000) {
                    voSalaire.dBrut = voSalaire.dBrut + 50000
                                                
                }   else {
                if ((NetRecherche - dNet) > 20000) {
                    voSalaire.dBrut = voSalaire.dBrut + 20000
                                                    
                }   else {
                if ((NetRecherche - dNet) > 10000) {
                    voSalaire.dBrut = voSalaire.dBrut + 10000
                                                        
                }   else {
                if ((NetRecherche - dNet) > 5000) {
                    voSalaire.dBrut = voSalaire.dBrut + 5000
                                                            
                }   else {
                if ((NetRecherche - dNet) > 1000) {
                    voSalaire.dBrut = voSalaire.dBrut + 1000

                }   else {
                if ((NetRecherche - dNet) > 500) {
                    voSalaire.dBrut = voSalaire.dBrut + 500

                }   else {
                if ((NetRecherche - dNet) > 400) {
                    voSalaire.dBrut = voSalaire.dBrut + 400
                
                }   else {
                if ((NetRecherche - dNet) > 300) {
                    voSalaire.dBrut = voSalaire.dBrut + 300
                
                }   else {
                if ((NetRecherche - dNet) > 200) {
                    voSalaire.dBrut = voSalaire.dBrut + 200
                
                }   else {
                if ((NetRecherche - dNet) > 100) {
                    voSalaire.dBrut = voSalaire.dBrut + 100
                
                }   else {
                if ((NetRecherche - dNet) > 50) {
                    voSalaire.dBrut = voSalaire.dBrut + 50
                
                }   else {
                if ((NetRecherche - dNet) > 40) {
                    voSalaire.dBrut = voSalaire.dBrut + 40
                
                }   else {
                if ((NetRecherche - dNet) > 30) {
                    voSalaire.dBrut = voSalaire.dBrut + 30
                
                }   else {
                if ((NetRecherche - dNet) > 20) {
                    voSalaire.dBrut = voSalaire.dBrut + 20
                
                }   else {
                if ((NetRecherche - dNet) > 10) {
                    voSalaire.dBrut = voSalaire.dBrut + 10
                
                }   else {
                if ((NetRecherche - dNet) > 9) {
                    voSalaire.dBrut = voSalaire.dBrut + 9
                
                }   else {
                if ((NetRecherche - dNet) > 8) {
                    voSalaire.dBrut = voSalaire.dBrut + 8
                
                }   else {
                if ((NetRecherche - dNet) > 7) {
                    voSalaire.dBrut = voSalaire.dBrut + 7
                
                }   else {
                if ((NetRecherche - dNet) > 6) {
                    voSalaire.dBrut = voSalaire.dBrut + 6
                
                }   else {
                if ((NetRecherche - dNet) > 5) {
                    voSalaire.dBrut = voSalaire.dBrut + 5
                
                }   else {
                if ((NetRecherche - dNet) > 4) {
                    voSalaire.dBrut = voSalaire.dBrut + 4
                
                }   else {
                if ((NetRecherche - dNet) > 3) {
                    voSalaire.dBrut = voSalaire.dBrut + 3
                                                                            
                }   else {
                if ((NetRecherche - dNet) > 2) { voSalaire.dBrut = voSalaire.dBrut + 2}
                                                                                    }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return true
    }
}
