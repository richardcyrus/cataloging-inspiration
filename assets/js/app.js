/* global jQuery */

/**
 * Cataloging Inspiration
 *
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2018 Richard Cyrus, Allie Valder, Wynston Saamoi
 */

;(function ($) {
    "use strict";

    const UnsplashSlider = (function () {

        const searchImages = $('.image-search');
        const searchImageInput = $('.image-term');
        const searchCollections = $('.collection-search');
        const searchCollectionInput = $('.collection-term');
        const imageCards = $('.image-set');

        const carouselContainer = $('.carousel-inner');
        const tagsContainer = $('.tag-cloud');
        const collectionsContainer = $('.collections');

        const baseUrl = 'https://api.unsplash.com/';
        const authHeader = {
            'Accept-Version': 'v1',
            'Authorization': 'Client-ID 181550b20f8c0d72ff4755e797725bd75195b0df6d258d10bc2f3affc9bc874a'
        };

        const registerHandlers = function () {
            searchImages.on('submit', function (event) {
                event.preventDefault();

                const searchTerm = searchImageInput.val().trim();

                if (searchTerm !== '') {
                    findPhotos(searchTerm, 1);
                }
            });

            searchCollections.on('submit', function (event) {
                event.preventDefault();

                const searchTerm = searchCollectionInput.val().trim();

                if (searchTerm !== '') {
                    findCollections(searchTerm, 1);
                }
            });

            collectionsContainer.on('click', 'a', function () {
                const collectionId = $(this).attr('data-collection-id');
                getCollectionPhotos(collectionId);

                // const totalPhotos = $(this).attr('data-total-photos');
                // getCollectionPhotos(collectionId, 1, totalPhotos);
            });

            imageCards.on('click', '.save-photo', function (event) {
                event.preventDefault();
                $(this).children('span').toggleClass('fas');
                // TODO: Save the selected image
            });
        };

        /* Collection Work */

        const findCollections = function (term, page) {
            const searchUrl = `${baseUrl}search/collections`;
            const data = {
                query: term,
                page: page,
                'per_page': 10,
            };

            $.ajax({
                url: searchUrl,
                data: data,
                headers: authHeader
            }).done(function (response) {
                return buildCollectionList(response.results);
            });
        };

        const buildCollectionList = function (data) {
            let list = $('<ul/>').addClass('list-group');

            data.forEach((item) => {
                const listEntry = $("<li/>")
                    .addClass('list-group-item d-flex flex-row justify-content-between align-items-center')
                    .append(
                        buildCollectionLink(item),
                        buildPhotoCountBadge(item['total_photos'])
                    );
                list.append(listEntry);
            });

            collectionsContainer.html(list);
        };

        const buildCollectionLink = function (data) {
            return $('<a/>').attr({
                'data-collection-id': data.id,
                'data-total-photos': data['total_photos'],
                href: '#'
            }).append(data.title);
        };

        const buildPhotoCountBadge = function (count) {
            return $('<span/>').addClass('badge badge-primary badge-pill').text(count);
        };

        const getCollectionPhotos = function (id, page = 1, per_page = 10) {
            const searchUrl = `${baseUrl}/collections/${id}/photos`;
            const data = {
                page: page,
                'per_page': per_page,
            };

            $.ajax({
                url: searchUrl,
                data: data,
                headers: authHeader
            }).done(function (response) {
                imageCards.empty();
                buildImages(response);
            });
        };
        /* #endregion Collection Work */

        /* #region Photo Work */
        const buildImages = function (photos) {
            photos.forEach((photo) => {
                const image = $('<img/>')
                    .attr({
                        alt: photo.description,
                        src: photo.urls.full,
                        'data-photo-id': photo.id
                    }).addClass('card-img-top');

                buildCards(image);
            });
        };

        const buildImageTaggingLink = function (photo) {
            const span = $('<span/>')
                .addClass('far fa-heart')
                .attr('data-photo-id', photo.id);
            const anchor = $('<a/>')
                .attr({
                    href: '#',
                    'data-photo-id': photo.id
                })
                .addClass('save-photo');

            return anchor.append('Favourite&nbsp;', span);
        };

        const buildCards = function (image) {
            const favourite = $('<div/>')
                .addClass('card-text text-center').append(
                    buildImageTaggingLink({id: image.attr('data-photo-id')})
                );

            const caption = $('<div/>')
                .addClass('card-body py-2').append(favourite);

            const card = $('<div/>')
                .addClass('card d-inline-block border-dark bg-light')
                .append(image, caption);

            imageCards.append(card);
        };

        const findPhotos = function (term, page, collections, orientation) {
            const searchUrl = `${baseUrl}search/photos`;
            const data = {
                query: term,
                page: page,
                per_page: 10,
                collections: collections,
                orientation: orientation
            };

            $.ajax({
                url: searchUrl,
                data: data,
                headers: authHeader
            }).done(function (response) {
                console.log(response);
            });
        };

        const getSinglePhoto = function (id, width, height, rectangle) {
            const searchUrl = `${baseUrl}/photos/${id}`;
            const data = {
                w: width,
                h: height,
                rect: rectangle
            };
        };

        const buildCarouselCaption = function (description) {
            const h5 = $("<h5/>").text(description);
            return $("<div/>").append(h5).addClass('carousel-caption d-none d-md-block');
        };

        const buildCarouselImage = function (photo) {
            return $("<img/>").addClass("d-block w-100 img-fluid").attr({
                alt: photo.description,
                src: photo.urls.small,
                'data-image-id': photo.id
            });
        };

        const buildCarouselItem = function (photo, active) {
            return $("<div/>").addClass(`carousel-item ${active}`)
                .append(buildCarouselImage(photo), buildCarouselCaption(photo.description));
        };

        /* #endregion Photo Work */

        /* Module Setup */

        const setup = function () {
            registerHandlers();
        };

        return {
            start: setup
        };
    })();

    UnsplashSlider.start();
})(jQuery);
