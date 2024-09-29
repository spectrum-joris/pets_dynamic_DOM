SELECT name, owner, species, sex, birth, death,
    COALESCE(DATEDIFF(death, birth), DATEDIFF(CURRENT_DATE, birth)) AS age
FROM pets
ORDER BY age DESC;


