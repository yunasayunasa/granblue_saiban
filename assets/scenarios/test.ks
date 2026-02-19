*start
    [bg storage="bgtest" time="0"]
    [chara_show name="roger" storage="roger" pos="center"]

    #ロジャー
    やぁ！これはUIの検証用テストだよ。[br]1行目、2行目、3行目、4行目、5行目！[br]どうだい？30pxなら5行でも余裕で収まっているはずだよ。[br]これが以前の36pxだと、下の方が切れちゃってたんだ。
    [p]

    次は選択肢の重なりチェックだ。[br]ボタンをたくさん並べてみるから、[br]メッセージウィンドウの上に乗っても押せるか試してね！
    [l]

    [link target="*next" text="選択肢1：余裕で押せるはず"]
    [link target="*next" text="選択肢2：これもOK"]
    [link target="*next" text="選択肢3：ウィンドウに重なっても大丈夫"]
    [link target="*next" text="選択肢4：一番下のボタン"]
    [r]
    [s]

*next
    検証ありがとう！バッチリだね！
    [p]
    [jump storage="TitleScene"]
