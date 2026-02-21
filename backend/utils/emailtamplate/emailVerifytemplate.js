const resetPasswordtEmailTamplate = (verifyLink) => `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->

<style type="text/css">
@media only screen and (min-width: 620px) {
  .u-row { width: 600px !important; }
  .u-row .u-col { vertical-align: top; }
  .u-row .u-col-100 { width: 600px !important; }
}

@media only screen and (max-width: 620px) {
  .u-row-container { max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
  .u-row { width: 100% !important; }
  .u-row .u-col {
    display: block !important;
    width: 100% !important;
    min-width: 320px !important;
    max-width: 100% !important;
  }
  .u-row .u-col > div { margin: 0 auto; }
}

body { margin:0; padding:0 }
table,td,tr { border-collapse:collapse; vertical-align:top }
* { line-height:inherit }
table, td { color:#000000 }
#u_body a { color:#0000ee; text-decoration:underline }
</style>

<link href="https://fonts.googleapis.com/css?family=Cabin:400,700&display=swap" rel="stylesheet" type="text/css">
</head>

<body class="clean-body u_body" style="background-color:#f9f9f9;">
<table id="u_body" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;">
<tbody>
<tr>
<td>

<!-- HEADER -->
<div class="u-row-container">
  <div class="u-row" style="background-color:#00A36C;">
    <div class="u-col u-col-100">
      <div>
        <table width="100%">
          <tr>
            <td style="padding:40px 10px;text-align:center;color:#e5eaf5;">
              <strong>THANKS FOR SIGNING UP!</strong>
              <h1 style="color:#e5eaf5;">Verify Your E-mail Address</h1>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- BODY -->
<div class="u-row-container">
  <div class="u-row" style="background-color:#ffffff;">
    <div class="u-col u-col-100">
      <div>
        <table width="100%">
          <tr>
            <td style="padding:33px 55px;text-align:center;">
              <p style="font-size:18px;">Hi,</p>
              <p style="font-size:16px;">
                Please click the button below to verify your email address.
              </p>

              <a href=${verifyLink} target="_blank"
                style="display:inline-block;background:#00A36C;color:#ffffff;
                padding:14px 44px;border-radius:4px;text-decoration:none;font-weight:bold;">
                VERIFY YOUR EMAIL
              </a>

              <p style="margin-top:30px;">Thanks,<br/>Teamfintrack</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="u-row-container">
  <div class="u-row" style="background-color:#00A36C;">
    <div class="u-col u-col-100">
      <div>
        <table width="100%">
          <tr>
            <td style="padding:20px;text-align:center;color:#ffffff;">
              © FinTrack All Rights Reserved
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

</td>
</tr>
</tbody>
</table>
</body>
</html>
`
module.exports = resetPasswordtEmailTamplate;
