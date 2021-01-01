$(document).ready(function () {

    var keyword = '';
    var type = '';
    var page = 1;

    getList(1);

    // 리스트 조회
    function getList(pageNum, keyword, type) {
        page = pageNum;

        $.ajax({
            url: 'http://localhost:8080/board/',
            data: {
                amount: 6,
                pageNum: page,
                type: type,
                keyword: keyword
            },
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

                // console.log(pg);

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

    // 게시글 조회
    function getBoardByBno(bno) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/board/' + bno,
            dataType: 'json',
            success: function (result) {
                $('.read-modal-content').css('display', 'block');
                $('.update-modal-content').css('display', 'none');

                $('.read-modal-content .modal-title').html('');
                $('.read-modal-content .modal-body').html('');
                $('.modal-writer').html('');

                $('.read-modal-content .modal-title').html(result.title);
                $('.modal-writer').append('<p>' + result.writer + " (" + result.regDate.substring(0, 10) + ")" + '</p>');
                $('.read-modal-content .modal-body').append(result.content);
                $('.board-hidden-bno').val(result.bno);

                readModal.style.display = "block";

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    }

    // 게시글 검색
    $('.search-btn').on('click', function (e) {
        e.preventDefault();
        keyword = $('#search-keyword').val();
        type = $('#search-type').val();


        console.log(keyword, type)

        getList(1, keyword, type);
    });

    // 페이지 선택
    $('.pagination').on('click', 'a', function (e) {
        e.preventDefault();
        getList($(this).data('pagenum'), keyword, type);
    });

    // 게시글 선택 조회
    $('.board-all').on('click', '#bno-link', function (e) {
        e.preventDefault();

        var bno = $(this).data('bno');

        getBoardByBno(bno);
    });

    // 수정 버튼 클릭
    $('.board-update-form-btn').on('click', function (e) {
        var bno = $('.board-hidden-bno').val();

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/board/' + bno,
            dataType: 'json',
            success: function (result) {
                $('.read-modal-content').css('display', 'none');
                $('.update-modal-content').css('display', 'block');

                $('.update-modal-content #update-title').val(result.title);
                $('.update-modal-content #update-content').val(result.content);

                readModal.style.display = "block";

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });

    // 게시글 수정
    $('.board-update-btn').on('click', function (e) {
        var bno = $('.board-hidden-bno').val();

        var title = $('.update-modal-content #update-title').val();
        var content = $('.update-modal-content #update-content').val();

        console.log(title, content)

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/board/',
            data: {bno: bno, title: title, content: content},
            success: function (result) {
                console.log('success : ' + result);
                getList(page, keyword, type);
                getBoardByBno(bno);

            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });

    // 게시글 등록
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
                getList(page, keyword, type);
                location.href = '#all';
                $('#reg-title').val('');
                $('#reg-content').val('');
                $('#reg-writer').val('');
            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });

    // 게시글 삭제
    $('.board-delete').on('click', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:8080/board/',
            data: {
                bno: $('.board-hidden-bno').val(),
            },
            success: function (result) {
                console.log('success : ' + result);
                getList(page, keyword, type);
                readModal.style.display = "none";
            }, error: function (request, status, error) {
                console.log('Error: ' + request.responseText);
            }
        });
    });
});


// 모달 관련 이벤트
// Get the modal
var readModal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
$('.close').on('click', function () {
    $('.read-modal-content').css('display', 'block');
    $('.update-modal-content').css('display', 'none');
    readModal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == readModal) {
        $('.read-modal-content').css('display', 'block');
        $('.update-modal-content').css('display', 'none');
        readModal.style.display = "none";
    }
}