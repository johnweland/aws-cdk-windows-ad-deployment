
# Install Active Directory Domain Services
Install-windowsfeature AD-domain-services

Import-Module ADDSDeployment

Install ADDSForrest
-CreateDNSDelegation:$false `
-DatabasePath "C:\Windows\NTDS" `
-DomainMode: "Win2016" `
-DomainName: "<yourdomain>" `
-ForestMode: "Win2016" `
-InstallDns: $true `
-LogPath "C:\Windows\NTDS" `
-NoRebootOnCompletion: $false `
-SysvolPath "C:\Windows\SYSVOL" `
-Force: $true `