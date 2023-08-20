import "server-only";
import {createTRPCRouter} from "@/trpc";
import scarchFavorite from "@/trpc/routers/wxfavorite/search-favorite";
import cancelFavorite from "@/trpc/routers/wxfavorite/cancel-favorite";
import addFavorite from "@/trpc/routers/wxfavorite/add-favorite";
import addFavoritePaper from "@/trpc/routers/wxfavorite/add-favorite-paper";
import scarchFavoritePaper from "@/trpc/routers/wxfavorite/search-favorite-paper";


const wxfavoriteRouter = createTRPCRouter({
    cancelFavorite,
    addFavorite,
    addFavoritePaper,
    scarchFavoritePaper,
    scarchFavorite
});

export default wxfavoriteRouter;
