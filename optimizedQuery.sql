SELECT
    u.id,
    u.name,
    COUNT(p.id) AS post_count,
    c.id,
    c.content,
    c."createdAt"
FROM
    users u
    JOIN posts p ON u.id = p."userId"
    LEFT JOIN (
        SELECT
            c1."userId",
            c1.id,
            c1.content,
            c1."createdAt"
        FROM
            comments c1
        WHERE
            c1."createdAt" = (
                SELECT
                    MAX(c2."createdAt")
                FROM
                    Comments c2
                WHERE
                    c2."userId" = c1."userId"
            )
    ) c ON u.id = c."userId"
GROUP BY
    u.id,
    u.name,
    c.id,
    c.content,
    c."createdAt"
ORDER BY
    post_count DESC
LIMIT
    3;