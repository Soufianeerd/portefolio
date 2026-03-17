//
//  BaremeImpot.swift
//  iApsal
//
//  Created by Xav Boulot on 12/05/2023.
//
// Définition du barême d'impot 2017
/******************************************************************************/
import Foundation

class baremeImpot {
    
    var classe:Int = -1
    var mntlimite:Double = 0
    var pourcentage:Double = 0
    var mntdeductible:Double = 0
    var mntimposable:Double = 0
    
    func Bareme2025() -> Bool{
        if (classe==100) {
            if (mntimposable > 0 && mntimposable <= 1185) {
                mntlimite=1185;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 1185 && mntimposable <= 1370) {
                mntlimite=1370;
                pourcentage=8;
                mntdeductible=95.0;
            }
            if (mntimposable > 1370 && mntimposable <= 1555) {
                mntlimite=1555;
                pourcentage=9;
                mntdeductible=108.7125;
            }
            if (mntimposable > 1465 && mntimposable <= 1735) {
                mntlimite=1735;
                pourcentage=10;
                mntdeductible=124.2625;
            }
            if (mntimposable > 1735 && mntimposable <= 1920) {
                mntlimite=1920;
                pourcentage=11;
                mntdeductible=141.65;
            }
            if (mntimposable > 1920 && mntimposable <= 2105) {
                mntlimite=2105;
                pourcentage=12;
                mntdeductible=160.875;
            }
            if (mntimposable > 2105 && mntimposable <= 2295) {
                mntlimite=2295;
                pourcentage=14;
                mntdeductible=203.0;
            }
            if (mntimposable > 2295 && mntimposable <= 2485) {
                mntlimite=2485;
                pourcentage=16;
                mntdeductible=248.95;
            }
            if (mntimposable > 2485 && mntimposable <= 2680) {
                mntlimite=2680;
                pourcentage=18;
                mntdeductible=298.725;
            }
            if (mntimposable > 2680 && mntimposable <= 2870) {
                mntlimite=2870;
                pourcentage=20;
                mntdeductible=352.325;
            }
            if (mntimposable > 2870 && mntimposable <= 3060) {
                mntlimite=3060;
                pourcentage=22;
                mntdeductible=409.75;
            }
            if (mntimposable > 3060 && mntimposable <= 3250) {
                mntlimite=3250;
                pourcentage=24;
                mntdeductible=471.0;
            }
            if (mntimposable > 3250 && mntimposable <= 3445) {
                mntlimite=3445;
                pourcentage=26;
                mntdeductible=536.075;
            }
            if (mntimposable > 3445 && mntimposable <= 3635) {
                mntlimite=3635;
                pourcentage=28;
                mntdeductible=604.975;
            }
            if (mntimposable > 3635 && mntimposable <= 3825) {
                mntlimite=3825;
                pourcentage=30;
                mntdeductible=677.70;
            }
            if (mntimposable > 3825 && mntimposable <= 4015) {
                mntlimite=4015;
                pourcentage=32;
                mntdeductible=754.25;
            }
            if (mntimposable > 4015 && mntimposable <= 4210) {
                mntlimite=3955;
                pourcentage=34;
                mntdeductible=834.625;
            }
            if (mntimposable > 3955 && mntimposable <= 4400) {
                mntlimite=4210;
                pourcentage=36;
                mntdeductible=918.825;
            }
            if (mntimposable > 4210 && mntimposable <= 4590) {
                mntlimite=4590;
                pourcentage=38;
                mntdeductible=1006.85;
            }
            if (mntimposable > 4590 && mntimposable <= 9870) {
                mntlimite=9870;
                pourcentage=39;
                mntdeductible=1052.775;
            }
            if (mntimposable > 9870 && mntimposable <= 14765) {
                mntlimite=14765;
                pourcentage=40;
                mntdeductible=1151.50;
            }
            if (mntimposable > 14765 && mntimposable <= 19655) {
                mntlimite=19655;
                pourcentage=41;
                mntdeductible=1299.15;
            }
            if (mntimposable > 19655) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1495.725;
            }
        }
        // Classe 200
        if (classe==200) {
            if (mntimposable > 0 && mntimposable <= 2290) {
                mntlimite=2290;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 2290 && mntimposable <= 2655) {
                mntlimite=2655;
                pourcentage=8;
                mntdeductible=183.20;
            }
            if (mntimposable > 2655 && mntimposable <= 3025) {
                mntlimite=3025;
                pourcentage=9;
                mntdeductible=209.775;
            }
            if (mntimposable > 3025 && mntimposable <= 3390) {
                mntlimite=3390;
                pourcentage=10;
                mntdeductible=240.025;
            }
            if (mntimposable > 3390 && mntimposable <= 3760) {
                mntlimite=3760;
                pourcentage=11;
                mntdeductible=273.95;
            }
            if (mntimposable > 3760 && mntimposable <= 4125) {
                mntlimite=4125;
                pourcentage=12;
                mntdeductible=311.55;
            }
            if (mntimposable > 4125 && mntimposable <= 4510) {
                mntlimite=4510;
                pourcentage=14;
                mntdeductible=394.10;
            }
            if (mntimposable > 4510 && mntimposable <= 4890) {
                mntlimite=4890;
                pourcentage=16;
                mntdeductible=484.30;
            }
            if (mntimposable > 4890 && mntimposable <= 5275) {
                mntlimite=5275;
                pourcentage=18;
                mntdeductible=582.15;
            }
            if (mntimposable > 5275 && mntimposable <= 5655) {
                mntlimite=5655;
                pourcentage=20;
                mntdeductible=687.65;
            }
            if (mntimposable > 5655 && mntimposable <= 6040) {
                mntlimite=6040;
                pourcentage=22;
                mntdeductible=800.80;
            }
            if (mntimposable > 6040 && mntimposable <= 6420) {
                mntlimite=6030;
                pourcentage=24;
                mntdeductible=921.60;
            }
            if (mntimposable > 6030 && mntimposable <= 6805) {
                mntlimite=6420;
                pourcentage=26;
                mntdeductible=1050.05;
            }
            if (mntimposable > 6420 && mntimposable <= 7185) {
                mntlimite=7185;
                pourcentage=28;
                mntdeductible=1186.15;
            }
            if (mntimposable > 7185 && mntimposable <= 7570) {
                mntlimite=7570;
                pourcentage=30;
                mntdeductible=1329.90;
            }
            if (mntimposable > 7570 && mntimposable <= 7950) {
                mntlimite=7950;
                pourcentage=32;
                mntdeductible=1481.30;
            }
            if (mntimposable > 7950 && mntimposable <= 8335) {
                mntlimite=8335;
                pourcentage=34;
                mntdeductible=1640.35;
            }
            if (mntimposable > 8335 && mntimposable <= 8715) {
                mntlimite=8715;
                pourcentage=36;
                mntdeductible=1807.05;
            }
            if (mntimposable > 8715 && mntimposable <= 9100) {
                mntlimite=9100;
                pourcentage=38;
                mntdeductible=1981.40;
            }
            if (mntimposable > 9100 && mntimposable <= 119660) {
                mntlimite=119660;
                pourcentage=39;
                mntdeductible=2072.40;
            }
            if (mntimposable > 119660 && mntimposable <= 29445) {
                mntlimite=29445;
                pourcentage=40;
                mntdeductible=2269.00;
            }
            if (mntimposable > 29445 && mntimposable <= 39230) {
                mntlimite=39230;
                pourcentage=41;
                mntdeductible=2563.45;
            }
            if (mntimposable > 39230) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=2955.75;
            }
        }
        // classe 300
        if (classe==300) {
            if (mntimposable > 0 && mntimposable <= 2290) {
                mntlimite=2290;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 2290 && mntimposable <= 2435) {
                mntlimite=2435;
                pourcentage=10;
                mntdeductible=229.0;
            }
            if (mntimposable > 2435 && mntimposable <= 2580) {
                mntlimite=2580;
                pourcentage=11.25;
                mntdeductible=259.4625;
            }
            if (mntimposable > 2580 && mntimposable <= 2730) {
                mntlimite=2730;
                pourcentage=12.50;
                mntdeductible=291.7625;
            }
            if (mntimposable > 2730 && mntimposable <= 2875) {
                mntlimite=2875;
                pourcentage=13.75;
                mntdeductible=325.90;
            }
            if (mntimposable > 2875 && mntimposable <= 3025) {
                mntlimite=3025;
                pourcentage=15;
                mntdeductible=361.875;
            }
            if (mntimposable > 3025 && mntimposable <= 3175) {
                mntlimite=3175;
                pourcentage=17.50;
                mntdeductible=437.50;
            }
            if (mntimposable > 3175 && mntimposable <= 3330) {
                mntlimite=3330;
                pourcentage=20;
                mntdeductible=516.95;
            }
            if (mntimposable > 3330 && mntimposable <= 3480) {
                mntlimite=3480;
                pourcentage=22.50;
                mntdeductible=600.225;
            }
            if (mntimposable > 3480 && mntimposable <= 3635) {
                mntlimite=3635;
                pourcentage=25;
                mntdeductible=687.325;
            }
            if (mntimposable > 3635 && mntimposable <= 3790) {
                mntlimite=3790;
                pourcentage=27.50;
                mntdeductible=778.25;
            }
            if (mntimposable > 3790 && mntimposable <= 3940) {
                mntlimite=3940;
                pourcentage=30;
                mntdeductible=873.0;
            }
            if (mntimposable > 3940 && mntimposable <= 4095) {
                mntlimite=4095;
                pourcentage=32.50;
                mntdeductible=972.575;
            }
            if (mntimposable > 4095 && mntimposable <= 4245) {
                mntlimite=4245;
                pourcentage=35;
                mntdeductible=1073.975;
            }
            if (mntimposable > 4245 && mntimposable <= 4400) {
                mntlimite=4400;
                pourcentage=37.50;
                mntdeductible=1180.20;
            }
            if (mntimposable > 4400 && mntimposable <= 9870) {
                mntlimite=9870;
                pourcentage=39;
                mntdeductible=1246.23;
            }
            if (mntimposable > 9870 && mntimposable <= 14765) {
                mntlimite=14765;
                pourcentage=40;
                mntdeductible=1344.955;
            }
            if (mntimposable > 14765 && mntimposable <= 19655) {
                mntlimite=19655;
                pourcentage=41;
                mntdeductible=1492.605;
            }
            if (mntimposable > 19655) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1689.18;
            }
        }
        return true
                
    }
    
    func Bareme2017() -> Bool{
        if (classe==100) {
            if (mntimposable > 0 && mntimposable <= 1020) {
                mntlimite=1020;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 1020 && mntimposable <= 1175) {
                mntlimite=1175;
                pourcentage=8;
                mntdeductible=81.90;
            }
            if (mntimposable > 1175 && mntimposable <= 1335) {
                mntlimite=1335;
                pourcentage=9;
                mntdeductible=93.6975;
            }
            if (mntimposable > 1335 && mntimposable <= 1490) {
                mntlimite=1490;
                pourcentage=10;
                mntdeductible=107.055;
            }
            if (mntimposable > 1490 && mntimposable <= 1645) {
                mntlimite=1645;
                pourcentage=11;
                mntdeductible=121.9725;
            }
            if (mntimposable > 1645 && mntimposable <= 1800) {
                mntlimite=1800;
                pourcentage=12;
                mntdeductible=138.45;
            }
            if (mntimposable > 1800 && mntimposable <= 1965) {
                mntlimite=1965;
                pourcentage=14;
                mntdeductible=174.525;
            }
            if (mntimposable > 1965 && mntimposable <= 2125) {
                mntlimite=2125;
                pourcentage=16;
                mntdeductible=213.84;
            }
            if (mntimposable > 2125 && mntimposable <= 2285) {
                mntlimite=2285;
                pourcentage=18;
                mntdeductible=256.395;
            }
            if (mntimposable > 2285 && mntimposable <= 2450) {
                mntlimite=2450;
                pourcentage=20;
                mntdeductible=302.19;
            }
            if (mntimposable > 2450 && mntimposable <= 2610) {
                mntlimite=2610;
                pourcentage=22;
                mntdeductible=351.225;
            }
            if (mntimposable > 2610 && mntimposable <= 2775) {
                mntlimite=2775;
                pourcentage=24;
                mntdeductible=403.50;
            }
            if (mntimposable > 2775 && mntimposable <= 2935) {
                mntlimite=2935;
                pourcentage=26;
                mntdeductible=459.015;
            }
            if (mntimposable > 2935 && mntimposable <= 3095) {
                mntlimite=3095;
                pourcentage=28;
                mntdeductible=517.77;
            }
            if (mntimposable > 3095 && mntimposable <= 3260) {
                mntlimite=3260;
                pourcentage=30;
                mntdeductible=579.765;
            }
            if (mntimposable > 3260 && mntimposable <= 3420) {
                mntlimite=3420;
                pourcentage=32;
                mntdeductible=645.00;
            }
            if (mntimposable > 3420 && mntimposable <= 3585) {
                mntlimite=3585;
                pourcentage=34;
                mntdeductible=713.475;
            }
            if (mntimposable > 3585 && mntimposable <= 3745) {
                mntlimite=3745;
                pourcentage=36;
                mntdeductible=785.19;
            }
            if (mntimposable > 3745 && mntimposable <= 3905) {
                mntlimite=3905;
                pourcentage=38;
                mntdeductible=860.145;
            }
            if (mntimposable > 3905 && mntimposable <= 8415) {
                mntlimite=8415;
                pourcentage=39;
                mntdeductible=899.2425;
            }
            if (mntimposable > 8415 && mntimposable <= 12585) {
                mntlimite=12585;
                pourcentage=40;
                mntdeductible=983.4275;
            }
            if (mntimposable > 12585 && mntimposable <= 16750) {
                mntlimite=16750;
                pourcentage=41;
                mntdeductible=1109.2775;
            }
            if (mntimposable > 16750) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1276.7975;
            }
        }
        // Classe 200
        if (classe==200) {
            if (mntimposable > 0 && mntimposable <= 1960) {
                mntlimite=1960;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 1960 && mntimposable <= 2270) {
                mntlimite=2270;
                pourcentage=8;
                mntdeductible=157.00;
            }
            if (mntimposable > 2270 && mntimposable <= 2585) {
                mntlimite=2585;
                pourcentage=9;
                mntdeductible=179.745;
            }
            if (mntimposable > 2585 && mntimposable <= 2895) {
                mntlimite=2895;
                pourcentage=10;
                mntdeductible=205.61;
            }
            if (mntimposable > 2895 && mntimposable <= 3210) {
                mntlimite=3210;
                pourcentage=11;
                mntdeductible=234.595;
            }
            if (mntimposable > 3210 && mntimposable <= 3520) {
                mntlimite=3520;
                pourcentage=12;
                mntdeductible=266.70;
            }
            if (mntimposable > 3520 && mntimposable <= 3845) {
                mntlimite=3845;
                pourcentage=14;
                mntdeductible=337.15;
            }
            if (mntimposable > 3845 && mntimposable <= 4170) {
                mntlimite=4170;
                pourcentage=16;
                mntdeductible=414.08;
            }
            if (mntimposable > 4170 && mntimposable <= 4490) {
                mntlimite=4490;
                pourcentage=18;
                mntdeductible=497.49;
            }
            if (mntimposable > 4490 && mntimposable <= 4815) {
                mntlimite=4815;
                pourcentage=20;
                mntdeductible=587.38;
            }
            if (mntimposable > 4815 && mntimposable <= 5140) {
                mntlimite=5140;
                pourcentage=22;
                mntdeductible=683.75;
            }
            if (mntimposable > 5140 && mntimposable <= 5465) {
                mntlimite=5465;
                pourcentage=24;
                mntdeductible=786.60;
            }
            if (mntimposable > 5465 && mntimposable <= 5790) {
                mntlimite=5790;
                pourcentage=26;
                mntdeductible=895.93;
            }
            if (mntimposable > 5790 && mntimposable <= 6110) {
                mntlimite=6110;
                pourcentage=28;
                mntdeductible=1011.74;
            }
            if (mntimposable > 6110 && mntimposable <= 6435) {
                mntlimite=6435;
                pourcentage=30;
                mntdeductible=1134.03;
            }
            if (mntimposable > 6435 && mntimposable <= 6790) {
                mntlimite=6790;
                pourcentage=32;
                mntdeductible=1262.80;
            }
            if (mntimposable > 6790 && mntimposable <= 7085) {
                mntlimite=7085;
                pourcentage=34;
                mntdeductible=1398.05;
            }
            if (mntimposable > 7085 && mntimposable <= 7410) {
                mntlimite=7410;
                pourcentage=36;
                mntdeductible=1539.78;
            }
            if (mntimposable > 7410 && mntimposable <= 7730) {
                mntlimite=7730;
                pourcentage=38;
                mntdeductible=1687.99;
            }
            if (mntimposable > 7730 && mntimposable <= 16750) {
                mntlimite=16750;
                pourcentage=39;
                mntdeductible=1765.335;
            }
            if (mntimposable > 16750 && mntimposable <= 25085) {
                mntlimite=25085;
                pourcentage=40;
                mntdeductible=1932.855;
            }
            if (mntimposable > 25085 && mntimposable <= 33415) {
                mntlimite=33415;
                pourcentage=41;
                mntdeductible=2183.705;
            }
            if (mntimposable > 33415) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=2517.895;
            }
        }
        // classe 300
        if (classe==300) {
            if (mntimposable > 0 && mntimposable <= 1960) {
                mntlimite=1960;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 1960 && mntimposable <= 2065) {
                mntlimite=2065;
                pourcentage=12;
                mntdeductible=235.50;
            }
            if (mntimposable > 2065 && mntimposable <= 2170) {
                mntlimite=2170;
                pourcentage=13.5;
                mntdeductible=266.4975;
            }
            if (mntimposable > 2170 && mntimposable <= 2270) {
                mntlimite=2270;
                pourcentage=15;
                mntdeductible=299.055;
            }
            if (mntimposable > 2270 && mntimposable <= 2375) {
                mntlimite=2375;
                pourcentage=16.5;
                mntdeductible=333.1725;
            }
            if (mntimposable > 2375 && mntimposable <= 2480) {
                mntlimite=2480;
                pourcentage=18;
                mntdeductible=368.85;
            }
            if (mntimposable > 2480 && mntimposable <= 2590) {
                mntlimite=2590;
                pourcentage=21;
                mntdeductible=443.325;
            }
            if (mntimposable > 2590 && mntimposable <= 2695) {
                mntlimite=2695;
                pourcentage=24;
                mntdeductible=521.040;
            }
            if (mntimposable > 2695 && mntimposable <= 2805) {
                mntlimite=2805;
                pourcentage=27;
                mntdeductible=601.995;
            }
            if (mntimposable > 2805 && mntimposable <= 2910) {
                mntlimite=2910;
                pourcentage=30;
                mntdeductible=686.19;
            }
            if (mntimposable > 2910 && mntimposable <= 3020) {
                mntlimite=3020;
                pourcentage=33;
                mntdeductible=773.625;
            }
            if (mntimposable > 3020 && mntimposable <= 3130) {
                mntlimite=3130;
                pourcentage=36;
                mntdeductible=864.30;
            }
            if (mntimposable > 3130 && mntimposable <= 8415) {
                mntlimite=8415;
                pourcentage=39;
                mntdeductible=958.215;
            }
            if (mntimposable > 8415 && mntimposable <= 12585) {
                mntlimite=12585;
                pourcentage=40;
                mntdeductible=1042.40;
            }
            if (mntimposable > 12585 && mntimposable <= 16750) {
                mntlimite=16750;
                pourcentage=41;
                mntdeductible=1168.25;
            }
            if (mntimposable > 16750) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1335.77;
            }
        }
        return true
                
    }
    
    func Bareme2024() -> Bool{
        if (classe==100) {
            if (mntimposable > 0 && mntimposable <= 1120) {
                mntlimite=1120;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 1120 && mntimposable <= 1290) {
                mntlimite=1290;
                pourcentage=8;
                mntdeductible=89.72;
            }
            if (mntimposable > 1290 && mntimposable <= 1465) {
                mntlimite=1465;
                pourcentage=9;
                mntdeductible=102.66;
            }
            if (mntimposable > 1465 && mntimposable <= 1635) {
                mntlimite=1635;
                pourcentage=10;
                mntdeductible=117.325;
            }
            if (mntimposable > 1635 && mntimposable <= 1810) {
                mntlimite=1810;
                pourcentage=11;
                mntdeductible=133.715;
            }
            if (mntimposable > 1810 && mntimposable <= 1980) {
                mntlimite=1980;
                pourcentage=12;
                mntdeductible=151.83;
            }
            if (mntimposable > 1980 && mntimposable <= 2160) {
                mntlimite=2160;
                pourcentage=14;
                mntdeductible=191.51;
            }
            if (mntimposable > 2160 && mntimposable <= 2340) {
                mntlimite=2340;
                pourcentage=16;
                mntdeductible=234.775;
            }
            if (mntimposable > 2340 && mntimposable <= 2520) {
                mntlimite=2520;
                pourcentage=18;
                mntdeductible=281.625;
            }
            if (mntimposable > 2520 && mntimposable <= 2700) {
                mntlimite=2700;
                pourcentage=20;
                mntdeductible=332.06;
            }
            if (mntimposable > 2700 && mntimposable <= 2880) {
                mntlimite=2880;
                pourcentage=22;
                mntdeductible=386.08;
            }
            if (mntimposable > 2880 && mntimposable <= 3055) {
                mntlimite=3055;
                pourcentage=24;
                mntdeductible=443.6850;
            }
            if (mntimposable > 3055 && mntimposable <= 3235) {
                mntlimite=3235;
                pourcentage=26;
                mntdeductible=504.875;
            }
            if (mntimposable > 3235 && mntimposable <= 3415) {
                mntlimite=3415;
                pourcentage=28;
                mntdeductible=569.65;
            }
            if (mntimposable > 3415 && mntimposable <= 3595) {
                mntlimite=3595;
                pourcentage=30;
                mntdeductible=638.010;
            }
            if (mntimposable > 3595 && mntimposable <= 3775) {
                mntlimite=3775;
                pourcentage=32;
                mntdeductible=709.955;
            }
            if (mntimposable > 3775 && mntimposable <= 3955) {
                mntlimite=3955;
                pourcentage=34;
                mntdeductible=785.485;
            }
            if (mntimposable > 3955 && mntimposable <= 4135) {
                mntlimite=4135;
                pourcentage=36;
                mntdeductible=864.60;
            }
            if (mntimposable > 4135 && mntimposable <= 4310) {
                mntlimite=4310;
                pourcentage=38;
                mntdeductible=947.30;
            }
            if (mntimposable > 4310 && mntimposable <= 9285) {
                mntlimite=9285;
                pourcentage=39;
                mntdeductible=990.4425;
            }
            if (mntimposable > 9285 && mntimposable <= 13885) {
                mntlimite=13885;
                pourcentage=40;
                mntdeductible=1083.295;
            }
            if (mntimposable > 13885 && mntimposable <= 18480) {
                mntlimite=18480;
                pourcentage=41;
                mntdeductible=1222.145;
            }
            if (mntimposable > 18480) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1406.9850;
            }
        }
        // Classe 200
        if (classe==200) {
            if (mntimposable > 0 && mntimposable <= 2155) {
                mntlimite=2155;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 2155 && mntimposable <= 2500) {
                mntlimite=2500;
                pourcentage=8;
                mntdeductible=172.64;
            }
            if (mntimposable > 2500 && mntimposable <= 2845) {
                mntlimite=2845;
                pourcentage=9;
                mntdeductible=197.67;
            }
            if (mntimposable > 2845 && mntimposable <= 3190) {
                mntlimite=3190;
                pourcentage=10;
                mntdeductible=226.15;
            }
            if (mntimposable > 3190 && mntimposable <= 3535) {
                mntlimite=3535;
                pourcentage=11;
                mntdeductible=258.08;
            }
            if (mntimposable > 3535 && mntimposable <= 3880) {
                mntlimite=3880;
                pourcentage=12;
                mntdeductible=293.46;
            }
            if (mntimposable > 3880 && mntimposable <= 4240) {
                mntlimite=4240;
                pourcentage=14;
                mntdeductible=371.12;
            }
            if (mntimposable > 4240 && mntimposable <= 4600) {
                mntlimite=4600;
                pourcentage=16;
                mntdeductible=455.95;
            }
            if (mntimposable > 4600 && mntimposable <= 4955) {
                mntlimite=4955;
                pourcentage=18;
                mntdeductible=547.95;
            }
            if (mntimposable > 4955 && mntimposable <= 5315) {
                mntlimite=5315;
                pourcentage=20;
                mntdeductible=647.12;
            }
            if (mntimposable > 5315 && mntimposable <= 5675) {
                mntlimite=5675;
                pourcentage=22;
                mntdeductible=753.46;
            }
            if (mntimposable > 5675 && mntimposable <= 6030) {
                mntlimite=6030;
                pourcentage=24;
                mntdeductible=866.97;
            }
            if (mntimposable > 6030 && mntimposable <= 6390) {
                mntlimite=6390;
                pourcentage=26;
                mntdeductible=987.65;
            }
            if (mntimposable > 6390 && mntimposable <= 6750) {
                mntlimite=6750;
                pourcentage=28;
                mntdeductible=1115.50;
            }
            if (mntimposable > 6750 && mntimposable <= 7105) {
                mntlimite=7105;
                pourcentage=30;
                mntdeductible=1250.52;
            }
            if (mntimposable > 7105 && mntimposable <= 7465) {
                mntlimite=7465;
                pourcentage=32;
                mntdeductible=1392.710;
            }
            if (mntimposable > 7465 && mntimposable <= 7825) {
                mntlimite=7825;
                pourcentage=34;
                mntdeductible=1542.07;
            }
            if (mntimposable > 7825 && mntimposable <= 8185) {
                mntlimite=8185;
                pourcentage=36;
                mntdeductible=1698.60;
            }
            if (mntimposable > 8185 && mntimposable <= 8540) {
                mntlimite=8540;
                pourcentage=38;
                mntdeductible=1862.30;
            }
            if (mntimposable > 8540 && mntimposable <= 18485) {
                mntlimite=18485;
                pourcentage=39;
                mntdeductible=1947.735;
            }
            if (mntimposable > 18485 && mntimposable <= 27685) {
                mntlimite=27685;
                pourcentage=40;
                mntdeductible=2132.59;
            }
            if (mntimposable > 27685 && mntimposable <= 36880) {
                mntlimite=36880;
                pourcentage=41;
                mntdeductible=2409.44;
            }
            if (mntimposable > 36880) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=2778.27;
            }
        }
        // classe 300
        if (classe==300) {
            if (mntimposable > 0 && mntimposable <= 2155) {
                mntlimite=2155;
                pourcentage=0;
                mntdeductible=0;
            }
            if (mntimposable > 2155 && mntimposable <= 2270) {
                mntlimite=2270;
                pourcentage=12;
                mntdeductible=258.960;
            }
            if (mntimposable > 2270 && mntimposable <= 2385) {
                mntlimite=2385;
                pourcentage=13.5;
                mntdeductible=293.055;
            }
            if (mntimposable > 2385 && mntimposable <= 2500) {
                mntlimite=2500;
                pourcentage=15;
                mntdeductible=328.875;
            }
            if (mntimposable > 2500 && mntimposable <= 2615) {
                mntlimite=2615;
                pourcentage=16.5;
                mntdeductible=366.42;
            }
            if (mntimposable > 2615 && mntimposable <= 2730) {
                mntlimite=2730;
                pourcentage=18;
                mntdeductible=405.69;
            }
            if (mntimposable > 2730 && mntimposable <= 2850) {
                mntlimite=2850;
                pourcentage=21;
                mntdeductible=487.68;
            }
            if (mntimposable > 2850 && mntimposable <= 2970) {
                mntlimite=2970;
                pourcentage=24;
                mntdeductible=573.255;
            }
            if (mntimposable > 2970 && mntimposable <= 3090) {
                mntlimite=3090;
                pourcentage=27;
                mntdeductible=662.415;
            }
            if (mntimposable > 3090 && mntimposable <= 3210) {
                mntlimite=3210;
                pourcentage=30;
                mntdeductible=755.16;
            }
            if (mntimposable > 3210 && mntimposable <= 3330) {
                mntlimite=3330;
                pourcentage=33;
                mntdeductible=851.49;
            }
            if (mntimposable > 3330 && mntimposable <= 3450) {
                mntlimite=3450;
                pourcentage=36;
                mntdeductible=951.4050;
            }
            if (mntimposable > 3450 && mntimposable <= 9285) {
                mntlimite=9285;
                pourcentage=39;
                mntdeductible=1054.905;
            }
            if (mntimposable > 9285 && mntimposable <= 13885) {
                mntlimite=13885;
                pourcentage=40;
                mntdeductible=1147.7575;
            }
            if (mntimposable > 13885 && mntimposable <= 18480) {
                mntlimite=18480;
                pourcentage=41;
                mntdeductible=1286.6075;
            }
            if (mntimposable > 18480) {
                mntlimite=999999999.99;
                pourcentage=42;
                mntdeductible=1471.44750;
            }
        }
        return true
                
    }
}


