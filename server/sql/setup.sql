createuser -P -s -d -U postgres Maxhu
createdb -O Maxhu -U Maxhu tcsn
psql -d tcsn -U Maxhu