//
//  videosList.swift
//  iApsal
//
//  Created by Xav Boulot on 06/02/2024.
//

import Foundation

struct LesVideos: Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var url: String? = nil
}

extension LesVideos {
    static var sampleData = [
        LesVideos(id:"1",
            title: "Manuel iApsal",
            url: "https://www.youtube.com/embed/tWD8Xf0f7x4?si=64QDonLWJs48YIGz?playsinline=1"),
        LesVideos(id:"2",
            title: "Apsal - Application salaires",
            url: "https://www.youtube.com/embed/tWD8Xf0f7x4?si=acHZ8t7JZwZLzld2?playsinline=1"),
        LesVideos(id:"3",
            title: "Gesall - Comptabilité",
            url: "https://www.youtube.com/embed/VGU2SaCejvk?si=9ZOHE48I8GWH9NTK?playsinline=1")
    ]
}
