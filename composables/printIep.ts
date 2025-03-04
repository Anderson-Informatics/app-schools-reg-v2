export const printIep = (item: any) => {
  const fname = item.FirstName;
  const lname = item.LastName;
  const iep = item.IEP;

  if (iep == "Yes" || iep == "MLL" || iep == "SD") {
    const accommodations = item.Accommodations;
    const labeltext = lname + ", " + fname + "\r\n" + accommodations;
    console.log(labeltext);
    try {
      // open label
      var labelXml =
        '<?xml version="1.0" encoding="utf-8"?>\
<DieCutLabel Version="8.0" Units="twips" MediaType="Default">\
<PaperOrientation>Portrait</PaperOrientation>\
<Id>Small30334</Id>\
<IsOutlined>false</IsOutlined>\
<PaperName>30334 2-1/4 in x 1-1/4 in</PaperName>\
<DrawCommands>\
<RoundRectangle X="0" Y="0" Width="3240" Height="1800" Rx="270" Ry="270" />\
</DrawCommands>\
<ObjectInfo>\
<TextObject>\
<Name>Text</Name>\
<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
<BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
<LinkedObjectName />\
<Rotation>Rotation0</Rotation>\
<IsMirrored>False</IsMirrored>\
<IsVariable>True</IsVariable>\
<GroupID>-1</GroupID>\
<IsOutlined>False</IsOutlined>\
<HorizontalAlignment>Center</HorizontalAlignment>\
<VerticalAlignment>Middle</VerticalAlignment>\
<TextFitMode>AlwaysFit</TextFitMode>\
<UseFullFontHeight>True</UseFullFontHeight>\
<Verticalized>False</Verticalized>\
<StyledText>\
    <Element>\
        <String xml:space="preserve">' +
        lname +
        ", " +
        fname +
        "\
" +
        accommodations +
        '</String>\
        <Attributes>\
            <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />\
        </Attributes>\
    </Element>\
</StyledText>\
</TextObject>\
<Bounds X="58" Y="86" Width="3123.77957447352" Height="1102" />\
</ObjectInfo>\
<ObjectInfo>\
<ShapeObject Stroke="SolidLine">\
<Name>SHAPE</Name>\
<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
<BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
<LinkedObjectName />\
<Rotation>Rotation0</Rotation>\
<IsMirrored>False</IsMirrored>\
<IsVariable>False</IsVariable>\
<GroupID>-1</GroupID>\
<IsOutlined>False</IsOutlined>\
<ShapeType>HorizontalLine</ShapeType>\
<LineWidth>15</LineWidth>\
<LineAlignment>Center</LineAlignment>\
<FillColor Alpha="0" Red="255" Green="255" Blue="255" />\
</ShapeObject>\
<Bounds X="183" Y="1290" Width="2880" Height="15" />\
</ObjectInfo>\
<ObjectInfo>\
<TextObject>\
<Name>TEXT</Name>\
<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />\
<BackColor Alpha="0" Red="255" Green="255" Blue="255" />\
<LinkedObjectName />\
<Rotation>Rotation0</Rotation>\
<IsMirrored>False</IsMirrored>\
<IsVariable>False</IsVariable>\
<GroupID>-1</GroupID>\
<IsOutlined>False</IsOutlined>\
<HorizontalAlignment>Left</HorizontalAlignment>\
<VerticalAlignment>Top</VerticalAlignment>\
<TextFitMode>ShrinkToFit</TextFitMode>\
<UseFullFontHeight>True</UseFullFontHeight>\
<Verticalized>False</Verticalized>\
<StyledText>\
    <Element>\
        <String xml:space="preserve">Power down all electronic devices before testing.</String>\
        <Attributes>\
            <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />\
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />\
        </Attributes>\
    </Element>\
</StyledText>\
</TextObject>\
<Bounds X="183" Y="1398" Width="2835" Height="255" />\
</ObjectInfo>\
</DieCutLabel>';

      var label = dymo.label.framework.openLabelXml(labelXml);

      // create label set to print data
      var labelSetBuilder = new dymo.label.framework.LabelSetBuilder();

      // first label
      var record = labelSetBuilder.addRecord();
      record.setText("Text", labeltext);

      // select printer to print on
      // for simplicity sake just use the first LabelWriter printer
      var printers = dymo.label.framework.getPrinters();

      if (printers.length == 0)
        throw "No DYMO printers are installed. Install DYMO printers.";

      var printerName = "";
      for (var i = 0; i < printers.length; ++i) {
        var printer = printers[i];
        if (
          printer.printerType == "LabelWriterPrinter" &&
          printer.isConnected == true
        ) {
          printerName = printer.name;
          break;
        }
      }

      if (printerName == "")
        throw "No LabelWriter printers found. Install LabelWriter printer";

      // finally print the label with default print params
      label.print(printerName, "", labelSetBuilder);
    } catch (e: any) {
      alert(e.message || e);
    }
  }
};
