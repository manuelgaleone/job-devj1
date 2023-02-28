<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;

class MoviesController extends AbstractController
{
    #[Route('/api/movies')]
    public function list(Connection $db, Request $request): Response
    {
        $sortByRating = $request->query->get('sort_by_rating') === 'true';
        $sortByReleaseDate = $request->query->get('sort_by_release_date') === 'true';

        $qb = $db->createQueryBuilder()
            ->select("m.*")
            ->from("movies", "m");

        if ($sortByRating) {
            $qb->orderBy("m.rating", "DESC");
        } else if ($sortByReleaseDate) {
            $qb->orderBy("m.release_date", "DESC");
        } else {
            $qb->orderBy("m.release_date", "DESC");
        }

        $rows = $qb
            ->setMaxResults(50)
            ->executeQuery()
            ->fetchAllAssociative();

        return $this->json([
            "movies" => $rows
        ]);
    }
}
