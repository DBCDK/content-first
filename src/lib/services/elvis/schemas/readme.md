# File names

Files are named by the pattern *service*-*datatype*-*direction*.*extension*.  So `elvis-profile-out.json` means that it contains a Profile as a JSON document as it comes out of the community service (Elvis).  A special case of `-out` is `-data`, which is convinient because basically everything successful request to Elvis returns somthing of the form `{ data: ... }`.
