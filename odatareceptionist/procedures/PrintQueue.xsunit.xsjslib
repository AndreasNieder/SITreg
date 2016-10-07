describe("Print Queue Tests", function() {    var cut = $.import("com.sap.sapmentors.sitreg.odatareceptionist.procedures", "PrintQueue");    var participant;    var ParticipantID;    var EventID;        beforeOnce(function() {        var select = 'SELECT TOP 1 "ID", "Participant"."EventID" '        + 'FROM "com.sap.sapmentors.sitreg.data::SITreg.Participant" AS "Participant" '        + 'LEFT JOIN "com.sap.sapmentors.sitreg.data::SITreg.Device" AS "Device" '        + 'ON "Device"."EventID" = "Participant"."EventID" '        + 'WHERE "Device"."DeviceID" IS NOT NULL';        var pStmt = jasmine.dbConnection.prepareStatement(select);        var rs = pStmt.executeQuery();        if (rs.next()) {            ParticipantID = rs.getInteger(1);            EventID = rs.getInteger(2);        }        pStmt.close();           });        it('should read participant details', function() {        participant = cut.readParticipant(ParticipantID);        expect(participant.ParticipantID).toBe(ParticipantID);        expect(participant.EventID).toBe(EventID);    });    it('should read devices for event', function() {        var devices = cut.getDevicesForEvent(EventID);        expect(devices.length).toBe(1);    });    it('should check that there is no entry in Print Queue with sent status', function() {        var boolean = cut.hasPrintQueueElementInSentStatusForEvent(EventID);        expect(boolean).toBe(false);    });        it('should fill print queue', function() {        var status = cut.addParticipantToPrintQueue(participant);        expect(status.error).toBe(undefined);    });    it('should check that there is an entry in Print Queue with sent status', function() {        var boolean = cut.hasPrintQueueElementInSentStatusForEvent(EventID);        expect(boolean).toBe(true);    });    it('check if participant was inserted', function() {        var boolean = cut.isParticipantInPrintQueue(ParticipantID);        expect(boolean).toBe(true);    });        afterOnce(function() {                var select = 'DELETE FROM "com.sap.sapmentors.sitreg.data::SITreg.PrintQueue" '    	    + 'WHERE "ParticipantID" = ?';        var pStmt = jasmine.dbConnection.prepareStatement(select);        pStmt.setInteger(1, participant.ParticipantID);        pStmt.execute();        jasmine.dbConnection.commit();         pStmt.close();            });});