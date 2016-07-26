moviename=('Chauranga' 'Wazir' 'Airlift' 'Jugni' 'Mastizaade' 'Fitoor' 'Neerja' 'Aligarh' 'Zubaan' 'Fan' 'Baaghi' 'Traffic' 'Azhar' 'Sarbjit' 'Cabaret' 'Phobia' 'Veerappan' 'Fredrick' 'Waiting' 'Housefull 3' 'Raaz Rebooted' 'Dhanak' 'Te3n' 'Junooniyat' 'Scandall')
q="'"

trim() {
  local s2 s="$*"
  # note: the brackets in each of the following two lines contain one space
  # and one tab
  until s2="${s#[   ]}"; [ "$s2" = "$s" ]; do s="$s2"; done
  until s2="${s%[   ]}"; [ "$s2" = "$s" ]; do s="$s2"; done
  echo "$s"
}



for (( i=0; i < ${#moviename[@]}; i++ ))    
do
#echo  $(trim $q${moviename[$i]}$q)
#node imdbapi $q${moviename[$i]}$q
node imdbapi ${moviename[$i]}
done