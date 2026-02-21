*cafe_scene
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]
    [chara_new name="sandalphon" jname="サンダルフォン"]
    [chara_new name="asuria" jname="アンスリア"]
    [chara_new name="diantha" jname="ディアンサ"]
    [chara_new name="nier" jname="ニーア"]
    [chara_new name="death" jname="デス"]

    ; 背景をカフェに変更
    [bg storage="bgtest" time="1000"]
    [playbgm storage="cafe" loop="true"]

    #
    君はナルメアと共にグランサイファー船内にある[br]カフェへと辿り着いた。
    [p]

    [chara_show name="sandalphon" storage="sandalphon_normal" pos="center" time="500" wait="true"]

    #サンダルフォン
    注文は？
    [p]

    [chara_hide name="sandalphon" time="200" wait="true"]

    [chara_show name="narumia" storage="narumia_normal" pos="center"]
    #ナルメア
    団長ちゃん！[br]この【熱々！ホットチョコレート】なんて[br]いいんじゃないかな？
    [p]

    #
    注文するのは...
    [l]

    ; 選択肢
    [link target="*order_original_blend" text="オリジナルブレンド"]
    [link target="*order_hot_chocolate" text="ホットチョコレート"]
    [r]
    [s]

*order_hot_chocolate
    [playbgm storage="night_bgm" loop="true"]
    君はホットチョコレートを注文した。
    [p]

    #ナルメア
    熱いからお姉さんがふーふーして[br]冷ましてあげるね、ふー、ふー...[br]はい、あーん
    [p]

    美味しい？よかった！
    [p]
    ふふっ♪すぐに見つかったね、[br]チョコがもらえる世界。
    [p]

    ハッピーバレンタイン♪
    [p]

    #
    君は無事チョコを貰うことができた。
    [p]
    ～ナルメアEND～
    [l]
    [chara_hide name="narumia" time="500" wait="true"]
    [jump storage="TitleScene"]
    [s]

*order_original_blend

    君はオリジナルブレンドを注文した。
    [p]

    #サンダルフォン
    オリジナルブレンドだ。
    [p]
    良ければ感想を聞かせて欲しい。
    [p]

    #
    君はコーヒーを一口飲んだ。
    [p]
    芳醇な香りが口の中に広がり、
    [p]
    調和の取れた苦味と酸味が踊り出す。
    [p]

    #サンダルフォン
    どうだ？
    [p]

    #
    君は答えた。
    [l]

    ; 選択肢
    [link target="*answer_bitter" text="...苦い"]
    [link target="*answer_delicious" text="...美味しい！"]
    [r]
    [s]

*answer_bitter

    君は苦いと答えた
    [p]

    [chara_show name="sandalphon" storage="sandalphon_normal" pos="center" time="300" wait="true"]
    #サンダルフォン
    そうか...、苦ければラテにする事もできる。
    [p]
    砂糖とミルクを置いておく、
    [p]
    好きに使うといい。
    [p]

    ...もう少し配合を変えてみるか。
    [p]

    #
    サンダルフォンは呟きながら、
    [p]
    考え込み始めた。
    [p]

    君はコーヒーを味わいながら、
    [p]
    もう少し寛ぐことにした。
    [p]
    [jump target="*three_girls_appear_common"]

*answer_delicious
    [playbgm storage="night_bgm" loop="true"]
    君は美味しいと答えた。
    [p]

    [chara_show name="sandalphon" storage="sandalphon_normal" pos="center" time="300" wait="true"]
    #サンダルフォン
    口にあったのならよかった。
    [p]
    ペアリングは要るか？
    [p]
    ...ちょうどバレンタインだしな.
    [p]
    こんなものでよければ、食べてくれ。
    [p]

    #
    サンダルフォンは、その華奢な指で丁寧に、
    [p]
    ラッピングが施された包みを差し出した。
    [p]

    #サンダルフォン
    ハッピーバレンタイン、団長。
    [p]

    #
    ～サンダルフォンEND～
    [l]
    [chara_hide name="sandalphon" time="500" wait="true"]
    [jump storage="TitleScene"]
    [s]

; ----- ディアンサ、アンスリア、ニーア登場シーン -----
*three_girls_appear_common

    #
    「「「団長さん、ここにいたんだ。[br]探したんだよ？」」」
    [p]

    君の前に3人の見目麗しい女性が現れた。[br]君を探していたようだ。
    [p]

    何やら殺気立っている様子だ。
    [l]

    ; ディアンサのセリフ
    [chara_show name="diantha" storage="diantha_normal" pos="left"]
    #ディアンサ
    団長さん！はい！チョコレート！[br]受け取って！
    [p]

    ; アンスリアのセリフ
    [chara_show name="asuria" storage="asuria_normal" pos="right"]
    #アンスリア
    チョコ、作ってきたの、団長さんの為に。[br]受け取って欲しいな...？
    [p]

    ; ニーアのセリフ
    [chara_show name="nier" storage="nier_normal" pos="center"]
    #ニーア
    団長さん...？[br]受け取ってくれるよね...？[br]愛して...くれるよね...？
    [p]

    #
    君は...
    [l]

    ; 選択肢 (誰から受け取るか)
    [link target="*receive_diantha_or_anthuria" text="ディアンサから受け取る"]
    [link target="*receive_diantha_or_anthuria" text="アンスリアから受け取る"]
    [link target="*receive_nier_good_end" text="ニーアから受け取る"]
    [r]
    [s]

*receive_diantha_or_anthuria
    [chara_hide name="nier" time="100" wait="true"]
    君はチョコを受け取った。
    [p]
    [stopbgm]

    [chara_show name="nier" storage="nier_yandere" pos="center" time="300" wait="true"]
    #ニーア
    どうして...？どうして受け取ってくれないの...？[br]愛してくれないの...？私のことを捨てるの...？[br]あの人達みたいに...
    [p]

    嫌！嫌あああああ！[br]お願い！捨てないで！私を...、愛して...
    [p]

    ; デス登場
    [chara_show name="death" storage="death_stand" pos="right"]
    #デス
    愛シイ人、人ノ愛ハ移リ行クモノ。[br]永遠ノ愛ヲ求メルナラ、答エハヒトツ...
    [p]

    ; ニーア再登場
    #ニーア
    ...そっか、そうだよね...。[br]移ろう前に...一つになればいいんだ...。
    [p]

    デス、お願い。
    [l]
    [p]

    #
    ......
    [p]

    ; ニーア再登場 (暗い背景に)
    #ニーア
    [chara_show name="nier" storage="nier_yandere" pos="center" time="300" wait="true"]
    ずっと、ずっと一緒だよ...。
    [p]

    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    うわあああああ！まずい！
    [p]
    再演算！演算し直さなきゃ！
    [p]
    [chara_hide name="roger" time="500" wait="true"]

    #
    BAD END
    [l]
    [p]
    [jump target="*three_girls_appear_common"]

*receive_nier_good_end
    [playbgm storage="night_bgm" loop="true"]
    君はニーアからチョコを受け取った。
    [p]

    [chara_show name="nier" storage="nier_normal" pos="center" time="300" wait="true"]
    #ニーア
    嬉しい...！私ね、団長さんの為なら[br]なんでもできる...。[br]団長さんが愛してくれるなら、なんでも...。
    [p]
    [chara_hide name="nier" time="200" wait="true"]

    ; ディアンサのセリフ
    [chara_show name="diantha" storage="diantha_normal" pos="center" time="300" wait="true"]
    #ディアンサ
    あー！ずるい！ニーアさんだけじゃなくて、[br]私のも受け取ってよ！
    [p]
    [chara_hide name="diantha" time="200" wait="true"]

    ; アンスリアのセリフ
    [chara_show name="asuria" storage="asuria_normal" pos="center" time="300" wait="true"]
    #アンスリア
    わ、私のも受け取って！[br]それで、中に手紙が入ってるの...！[br]そこで待ってるから！2人っきりで...
    [p]
    [chara_hide name="asuria" time="200" wait="true"]

    ; ナルメアのセリフ
    [chara_show name="narumia" storage="narumia_normal" pos="center" time="300" wait="true"]
    #ナルメア
    お姉さんも用意してあるんだから！[br]はい、あーんしてあげる♪
    [p]
    [chara_hide name="narumia" time="200" wait="true"]

    ; サンダルフォンのセリフ
    [chara_show name="sandalphon" storage="sandalphon_normal" pos="center" time="300" wait="true"]
    #サンダルフォン
    お前達、静かにしろ！
    [p]
    [chara_hide name="sandalphon" time="200" wait="true"]

    #
    ━━かしましい声が響き辺り、[br]今日もグランサイファーは平和そのものであった。
    [p]

    Good END
    [p]

    ???「...どうしよう。うち、完っ全に出遅れてる...！」
    [l]
    [jump storage="TitleScene"]
    [s]
