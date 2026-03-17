//
//  clsMaths.swift
//  iApsal
//
//  Created by Xav Boulot on 12/05/2023.
//
/******************************************************************************/
import Foundation

class clsMaths {
    
    func myRound(dbVal:Double, nPlaces:Int) -> Double
    {
        let dbShift:Decimal = pow(10.0,nPlaces)
       
        let temp:Double = Double(dbShift.description) ?? 0
        
        return floor(dbVal * temp + 0.5) / temp
    }
    
    
    func RoundUP(dbVal:Double, Decplace:Int) -> Double
    {
        /*
        let temp:Int  = Int(dbVal) * (10 ^ Decplace)
      
        let temp2:Double =  Double(temp) / Double(10 ^ Decplace)
        return temp2
        */
        return  ceil(dbVal * 100)/100
    }
}
/*

 func
//Round a double variable to nPlaces decimal places
- (double) myRound:(double) dbVal DecPlace:(int)nPlaces
{
    const double dbShift = pow(10.0,nPlaces);
    return floor(dbVal * dbShift + 0.5) / dbShift;
}

+ (double) mytest
{
    const double dbShift = pow(10.0,2);
    return floor(1225.455 * dbShift + 0.5) / dbShift;
}
*/
