$(document).ready(function () {

    getList(1);

    function getList(pageNum) {

        $.ajax({
            url: 'http://localhost:8080/board/',
            data: {amount: 6, pageNum: pageNum},
            dataType: 'json',
            success: function (result) {
                $('.board-all').html('');
                $('.pagination').html('');

                var board = result.board;
                var pg = result.pg;

                for (i = 0; i < board.length; i++) {
                    $('.board-all').append(
                        "<tr>\n" +
                        "\t<td>" + board[i].bno + "</td>\n" +
                        "\t<td><a href='' id='bno-link' data-bno='" + board[i].bno + "'>" + board[i].title + "</a></td>\n" +
                        "\t<td>" + board[i].writer + "</td>\n" +
                        "\t<td>" + board[i].regDate.substring(0, 10) + "</td>\n" +
                        "\t</tr>"
                    );
                }

                if (pg.prev) {
                    $('.pagination').append(
                        '<a href="#" data-pagenum="' + (pg.paging.pageNum - 1) + '">&laquo;</a>'
                    );
                }

                for (j = pg.start; j <= pg.end; j++) {
                    var active = pg.paging.pageNum == j ? 'active' : '';

                    $('.pagination').append(
                        '<a href="#" id="#page-num" class="' + active + '" data-pagenum="' + j + '">' + j + '</a>'
                    );
                }

                if (pg.next) {
                    $('.pagination').append(
                        '<a href="#"data-pagenum="' + (pg.paging.pageNum + 1) + '">&raquo;</a>'
                    );
                }

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    }

    $('.pagination').on('click', 'a', function (e) {
        e.preventDefault();
        getList($(this).data('pagenum'));
    });

    // 게시글 조회
    $('.board-all').on('click', '#bno-link', function (e) {
        e.preventDefault();

        var bno = $(this).data('bno');

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/board/' + bno,
            dataType: 'json',
            success: function (result) {
                $('.modal-title').html('');
                $('.modal-body').html('');
                $('.modal-writer').html('');

                $('.modal-title').html(result.title);
                $('.modal-writer').append('<p>' + result.writer + " (" + result.regDate.substring(0, 10) + ")" + '</p>');
                $('.modal-body').append(result.content);
                $('.board-hidden-bno').val(result.bno);

                readModal.style.display = "block";

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });

    // 게시글 수정 버튼 클릭
    $('.board-update-btn').on('click', function (e) {
        var bno = $('.board-hidden-bno').val();

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/board/' + bno,
            dataType: 'json',
            success: function (result) {
                $('.modal-title').html('');
                $('.modal-body').html('');

                $('.modal-title').html('<input type="text" value="' + result.title + '">');
                $('.modal-body').append('<textarea name="content" rows="6">' + result.content + '"</textarea>');
                readModal.style.display = "block";

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });

    $('.board-register').on('click', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/board/',
            data: {
                title: $('#reg-title').val(),
                content: $('#reg-content').val(),
                writer: $('#reg-writer').val()
            },
            success: function (result) {
                console.log('success : ' + result);
                getList();
                location.href = '#all';
                $('#reg-title').val('');
                $('#reg-content').val('');
                $('#reg-writer').val('');
            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });
});


// Get the modal
var readModal = document.getElementById("myModal");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    readModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        readModal.style.display = "none";
    }
}