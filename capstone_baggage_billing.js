
const tickets = [
    {
        pnr: "VN001",
        passengerName: "Nguyen Van An",
        flightNumber: "VN123",
        classType: "ECONOMY",
        membership: "NONE",
        baggageList: [
            {
                type: "NORMAL",
                weight: 18
            },
            {
                type: "NORMAL",
                weight: 8
            }
        ]
    },
    {
        pnr: "VN002",
        passengerName: "Tran Thi Binh",
        flightNumber: "VN456",
        classType: "BUSINESS",
        membership: "TITAN",
        baggageList: [
            {
                type: "GOLF",
                weight: 20
            },
            {
                type: "PET",
                weight: 5
            }
        ]
    }
];

function findTicketByPnr(pnr) {
    return tickets.find(
        ticket => ticket.pnr.toUpperCase() === pnr.toUpperCase()
    );
}

function getFreeBaggageWeight(ticket) {
    let freeWeight = 0;

    if (ticket.classType === "ECONOMY") {
        freeWeight = 20;
    } else if (ticket.classType === "BUSINESS") {
        freeWeight = 30;
    }

    if (
        ticket.membership === "TITAN" ||
        ticket.membership === "DIAMOND" ||
        ticket.membership === "GOLD"
    ) {
        freeWeight += 10;
    }

    return freeWeight;
}

function calculateExcessFee(excessWeight) {
    if (excessWeight <= 0) {
        return 0;
    }

    if (excessWeight <= 5) {
        return excessWeight * 60000;
    }

    return 5 * 60000 + (excessWeight - 5) * 80000;
}

function calculateSpecialFee(baggageList) {
    let oversizedFee = 0;
    let petFee = 0;

    baggageList.forEach(baggage => {
        if (
            baggage.type === "MUSICAL_INSTRUMENT" ||
            baggage.type === "GOLF"
        ) {
            oversizedFee += 200000;
        }

        if (baggage.type === "PET") {
            petFee += 500000;
        }
    });

    return {
        oversizedFee: oversizedFee,
        petFee: petFee
    };
}

function calculateBaggageSurcharge(ticket, baggageList) {
    let totalWeight = 0;

    baggageList.forEach(baggage => {
        totalWeight += baggage.weight;
    });

    const freeWeight = getFreeBaggageWeight(ticket);
    const excessWeight = Math.max(totalWeight - freeWeight, 0);
    const excessFee = calculateExcessFee(excessWeight);

    const specialFee = calculateSpecialFee(baggageList);

    const totalFee =
        excessFee +
        specialFee.oversizedFee +
        specialFee.petFee;

    return {
        totalWeight: totalWeight,
        freeWeight: freeWeight,
        excessWeight: excessWeight,
        excessFee: excessFee,
        oversizedFee: specialFee.oversizedFee,
        petFee: specialFee.petFee,
        totalFee: totalFee
    };
}

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + " VNĐ";
}

function printReceipt(ticket, baggageList, result) {
    console.log(`
============================================================
                 BIEN LAI PHU CUOC HANH LY
============================================================
PNR            : ${ticket.pnr}
Hanh khach     : ${ticket.passengerName}
Chuyen bay     : ${ticket.flightNumber}
Hang ve        : ${ticket.classType}
Hoi vien       : ${ticket.membership}

----------------------- HANH LY ----------------------------
${baggageList.map((baggage, index) =>
    `${String(index + 1).padEnd(5)}${baggage.type.padEnd(25)}${(baggage.weight + " kg").padStart(10)}`
).join("\n")}

------------------------------------------------------------
Tong trong luong       : ${String(result.totalWeight + " kg").padStart(25)}
Mien cuoc              : ${String(result.freeWeight + " kg").padStart(25)}
Vuot muc               : ${String(result.excessWeight + " kg").padStart(25)}

Phi qua cuoc           : ${formatMoney(result.excessFee).padStart(25)}
Phi hang cong kenh     : ${formatMoney(result.oversizedFee).padStart(25)}
Phi thu cung           : ${formatMoney(result.petFee).padStart(25)}

============================================================
TONG THANH TOAN        : ${formatMoney(result.totalFee).padStart(25)}
============================================================
                CAM ON QUY KHACH
============================================================
`);
}

function processBaggage() {
    console.log("\n===== TINH CUOC HANH LY =====");

    const pnr = prompt("Nhap ma PNR: ").trim().toUpperCase();

    if (pnr === "") {
        console.log("Ma PNR khong duoc de trong.");
        return;
    }

    const ticket = findTicketByPnr(pnr);

    if (!ticket) {
        console.log("Khong tim thay ve.");
        return;
    }

    const baggageCount = Number(
        prompt("Nhap so luong kien hanh ly: ")
    );

    if (
        isNaN(baggageCount) ||
        baggageCount <= 0 ||
        !Number.isInteger(baggageCount)
    ) {
        console.log("So luong kien hanh ly khong hop le.");
        return;
    }

    const baggageList = [];

    for (let i = 0; i < baggageCount; i++) {
        console.log("\nKien hanh ly " + (i + 1));

        const weight = Number(
            prompt("Nhap khoi luong (kg): ")
        );

        if (isNaN(weight) || weight <= 0) {
            console.log("Khoi luong khong hop le.");
            return;
        }

        console.log("1. NORMAL");
        console.log("2. MUSICAL_INSTRUMENT");
        console.log("3. GOLF");
        console.log("4. PET");

        const typeChoice = prompt("Chon loai hanh ly: ");

        let type;

        switch (typeChoice) {
            case "1":
                type = "NORMAL";
                break;

            case "2":
                type = "MUSICAL_INSTRUMENT";
                break;

            case "3":
                type = "GOLF";
                break;

            case "4":
                type = "PET";
                break;

            default:
                console.log("Loai hanh ly khong hop le.");
                return;
        }

        baggageList.push({
            type: type,
            weight: weight
        });
    }

    const result = calculateBaggageSurcharge(
        ticket,
        baggageList
    );

    printReceipt(
        ticket,
        baggageList,
        result
    );
}

function displayTickets() {
    console.log("\n===== DANH SACH VE =====");

    tickets.forEach(ticket => {
        console.log("--------------------------------------------");
        console.log("PNR: " + ticket.pnr);
        console.log("Hanh khach: " + ticket.passengerName);
        console.log("Chuyen bay: " + ticket.flightNumber);
        console.log("Hang ve: " + ticket.classType);
        console.log("Hoi vien: " + ticket.membership);
        console.log("So kien: " + ticket.baggageList.length);
    });

    console.log("--------------------------------------------");
}

function main() {
    let choice;

    do {
        console.log(`
================================================
       HE THONG TINH PHU CUOC HANH LY
================================================
1. Hien thi danh sach ve
2. Tinh cuoc hanh ly
3. Thoat
================================================
`);

        choice = prompt("Nhap lua chon: ");

        switch (choice) {
            case "1":
                displayTickets();
                break;

            case "2":
                processBaggage();
                break;

            case "3":
                console.log("Da thoat chuong trinh.");
                break;

            default:
                console.log("Lua chon khong hop le.");
        }
    } while (choice !== "3");
}

main();
