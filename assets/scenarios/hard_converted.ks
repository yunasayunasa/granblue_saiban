*auguste_arrival
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]
    [chara_new name="thug" jname="荒くれ者"]
    [chara_new name="lowain" jname="ローアイン"]
    [chara_new name="kaki" jname="カキフライ"]
    [chara_new name="nni" jname="ンニ"]
    [chara_new name="katuo" jname="カツウォヌス"]
    [chara_new name="same" jname="サメ"]
    [chara_new name="koa" jname="アルバコア"]
    [chara_new name="chocokoa" jname="チョコアルバコア"]
    [chara_new name="zombie" jname="ゾンビィ"]
    [chara_new name="ruria" jname="ルリア"]
    [chara_new name="oigen" jname="三羽烏"]
    [chara_new name="wilnas" jname="ウィルナス"]
    [chara_new name="luoh" jname="ル・オー"]
    [chara_new name="wamdus" jname="ワムデュス"]
    [chara_new name="galleon" jname="ガレオン"]
    [chara_new name="sandalphon" jname="サンダルフォン"]
    [chara_new name="diantha" jname="ディアンサ"]
    [chara_new name="anthuria" jname="アンスリア"]
    [chara_new name="nier" jname="ニーア"]
    [chara_new name="death" jname="デス"]
    [chara_new name="korwa" jname="コルワ"]

    [bg storage="bg_auguste" time="1000"]
    [playbgm storage="cafe" loop="true"]
    #
    君はアウギュステに降り立った。[br]街はバレンタイン一色に染まり、右を見ても左を見ても、[br]チョコを共に送り合う恋人達で溢れていた。
    [p]
    
    嫉妬の炎が胸を焦がす。このままでは狂ってしまうだろう。
    [p]

    君は...
    [l]

    ; 選択肢
    [link target="*dash_to_sea" text="海までダッシュ！"]
    [link target="*shopping_mindlessly_badend" text="無心で買い物へ"]
    [link target="*return_to_ship_badend" text="船に戻る"]
    [r]
    [s]

*return_to_ship_badend
    [bg storage="bg_inship" time="500"]
    君は船に戻った。[br]ムードに気圧され、圧倒された。[br]自分の情けなさに嫌気がさし、[br]君は膝を抱えたまま、眠りに落ちた。
    [p]
    BAD END 
    [l]
    [er]
    [jump storage="first_converted.ks" target="*start"]
    [s]

*shopping_mindlessly_badend
    [bg storage="bg_market" time="500"]
    君は無心で買い物へ出かけた。

    [p]
    「ねぇ、まりっぺ！これ美味しそう！」
    [p]
    「メグ...！これってカップル専用の...！[br]そんなに私の事を...！」
    [p]
    「ジュリエット、君にこのチョコ指輪を贈らせてくれ！」
    [p]
    「ロミオ...！」
    [p]
    無理だ、正気を保てる訳がない。
    [p]
    君は叫んだ、心の底から。[br]怨嗟の叫びが店内を揺らす。
    [p]
    ふと、誰かが、肩に手を置いた。
    [p]
    「事案ですか？」
    [p]
    
    BAD END 
    [l]
    [er]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*dash_to_sea 
    君は海まで走った。[br]海に着いた君は、無心で剣を振りつづけた。
    [p]
    999回、1000回━ [br]君の素振りは、音を置き去りにしていた。
    [p]

    そんな君の前に現れたのは...
    [l]

    ; 選択肢
    [link target="*thugs_appear_badend_hard" text="荒くれ者達"] 
    [link target="*sea_creatures_appear_hard" text="海のトンチキ生物達"]
    [link target="*lowain_appear_badend_hard" text="ローアイン達"]
    [r]
    [s]

*thugs_appear_badend_hard 
    [chara_show name="thug" storage="thug_normal" pos="center"]
    [vibrate time="200"]
    #荒くれ者
    [chara_zoom name="thug" scale="1.3" restore="true" restore_time="150"]
    こんなとこで剣なんか振ってんじゃねえよ！あぶねえだろうが！
    [p]
    #
    ...正論を振りかざされ、君は心が折れた。
    [p]
    [shake name="thug" time="400" power="8"]
    [chara_hide name="thug" time="300" wait="true"]
    BAD END 
    [l]
    [er]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*lowain_appear_badend_hard 
    [chara_show name="lowain" storage="lowain_normal" pos="center"]
    [chara_jump name="lowain"]
    #ローアイン
    ローアイン:あれ？ﾀﾞﾝﾁｮ？こんなとこで剣なんか振っちゃってDoしたん？
    [p]
    エルセム:俺たちそこの海の家でダベるんすよ！
    [p]
    トモイ:ﾀﾞﾝﾁｮも一緒にDoっすか？
    [p]
    #
    君はローアイン達と海の家でダベることにした。[br]妄想トークが捗り、非常に楽しい1日を過ごした━
    [p]
    [chara_hide name="lowain" time="300" wait="true"]
    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    ちょちょちょい！待って！チョコ忘れてない！？再演算！
    [p]
    [chara_hide name="roger" time="300" wait="true"]
    BAD END
    [l]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*sea_creatures_appear_hard 
    [playbgm storage="bgm_action" loop="true"]
    [chara_show name="kaki" storage="kaki" pos="left"]
    [chara_show name="nni" storage="nni" pos="right"]
    [chara_show name="katuo" storage="katuo" pos="center"]
    #
    目の前には海のトンチキ生物達が現れた。
    [p]
    無心で素振りをしていて、囲まれたことには気づいていなかったのだ
    [p]
    [vibrate time="300"]
    カキフライ、ンニ、カツウォヌス、前から後ろから、左右から、海の生物が襲いかかる。
    [p]
    どれから対処すべきか...
    [l]

    ; 選択肢
    [link target="*failed_battle_badend" text="ンニ"] 
    [link target="*progress_battle_1" text="カツウォヌス"] 
    [link target="*failed_battle_badend" text="カキフライ"] 
    [r]
    [s]

*failed_battle_badend
    [bg storage="bg_inship" time="500"]
    [fadeout]
    [stopbgm time="600"]
    [er]
    [chara_show name="ruria" time="300" wait="true"]
    #ルリア
    大丈夫ですか？[br]今、ティコさんを呼んできますね！
    [p]
    [chara_hide name="ruria" time="300" wait="true"]
    [fadein]
    #
    どうやら選択を誤ったらしい。[br]君は痛む体をさすりながら、眠りに落ちた。
    [p]
    BAD END 
    [l]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*progress_battle_1 
    [chara_hide name="katuo" time="200"]
     [chara_hide name="nni" time="200"]
      [chara_hide name="kaki" time="200"]
    [chara_show name="same" storage="same" pos="left"]
    [chara_show name="koa" storage="koa" pos="right"]
    #サメ
    [chara_zoom name="same" scale="1.4" restore="true" restore_time="150"]
    SYAAAAAAAAAAAAAAAK!!!!!
    [p]
    [slash count="2" time="250"]
    #アルバコア
    [chara_zoom name="koa" scale="1.4" restore="true" restore_time="150"]
    KOAAAAAAAAAAAAAAAAA!!!!!!!!!
    [p]
    [slash count="2" time="250"]
    サメ、アルバコア、さらに増援。君は選択を迫られる...
    [p]
    [l]

    ; 次の選択肢
    [link target="*final_battle_badend" text="ンナギ"]
    [link target="*final_battle_badend" text="ンニ"]
    [link target="*final_battle_badend" text="アルバコア"]
    [link target="*final_battle_badend" text="煉獄カツウォヌス"] 
    [r]
    [s]

*final_battle_badend
    [chara_hide name="same" time="200" wait="true"]
    [chara_hide name="koa" time="200" wait="true"]
    [chara_show name="zombie" storage="zombie" pos="center"]
    #ゾンビィ
    「ドライブイン！とっ！りっ！」
    [p]
    
    クァニ、灼弩火罹、ゾンビィ、更に増えるトンチキ生物達。
    [p]
    無理だ。1人では━ [br]君は押し迫る海の生物達の中に消えていった...。
    [p]
    [stopbgm time="1000"]
    [link target="*pseudo_prologue_start" text="再演算する"] 
    [link target="*start_return_title" text="あきらめる"]
    [r]
    [s]

*start_return_title
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]

*pseudo_prologue_start
   ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]

    ; プロローグ開始
    [fadeout]
    [stopbgm]
    [er]
    [playbgm storage="cafe" loop="true"]
    [bg storage="bg_enzan_world" time="1000"]
    [fadein]
    [wait time=1000]

    君は、どこか見覚えのある空間にいる。そうだ、確かこの後彼が...
    [p]

    [chara_show name="roger" storage="roger_normal" pos="center"]

    #ロジャー
    おはよう！お呼びとあらば即参上できない！[br]今日も今日とて限界勤務上等の[br]オロロジャイアちゃんでっす！
    [p]

    ｵﾎﾝｴﾍﾝ...!ここは演算世界。[br]僕の力で作り出された世界。[br]あらゆる可能性を探るための場所さ。
    [p]

    これから君には僕と一緒に旅をしてもらいたいんだ。[br]そう！君がチョコをもらえる世界を探り出す為に！
    [p]

    そんな訳で早速行ってみよう〜！[br]と言っても...僕は一緒に行ける訳ではないんだけどね！[br]社畜の悲しみ！
    [p]

    代わりにガチャ回させてあげるから許して！[br]はい！10連ガチャガチャっとね！
    [p]

    [chara_hide name="roger" time="500" wait="true"]

    
    1人の仲間が目の前に現れる。
    [p]

    #？？？
    それじゃあ、団長ちゃん、一緒に行こっか♪
    [p]

    #
    仲間になったのは...
    [l]

    ; 選択肢
    [link target="*pseudo_select_true_route" text="ナルメア"]
    [link target="*siete_route_start" text="シエテ"]
    [link target="*hard_mode_start" text="誰も仲間にしない"]
    [link target="*fenny_route_start" text="フェニー"]
    [r]
    [s]

; ----- 各ルートへの分岐 -----


*siete_route_start
    [chara_show name="siete" storage="siete_normal" pos="center" time="500" wait="true"]
    #シエテ
    やあ、団長ちゃん。俺と行くのかい？
    [p]
   
   
    [jump storage="siete_converted.ks"]

*hard_mode_start
    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    え！？誰もいらない！？[br]まぁ、君がそういうなら…[br]…その先は地獄だよ？
    [p]
    [chara_hide name="roger" time="500" wait="true"]
    [jump storage="hard_converted.ks"]

*fenny_route_start
    [chara_show name="fenny" storage="fenny_normal" pos="center" time="500" wait="true"]
    #フェニー
    団長さんとお出かけ楽しみなんだよ！
    [p]
   
   
    [jump storage="fenny_converted.ks"]


  
*pseudo_select_true_route
 [chara_show name="narumia" pos="left" time="500"]
    #ナルメア
    嬉しい！それじゃ一緒に...どうしてあなたもいるのかな？
    [p]
     [chara_show name="siete" pos="right" time="500"]
    #シエテ
    まぁまぁ、団長ちゃんには俺たちの両方の力が必要みたいだからね。
    [p]
    #ナルメア、シエテ
    「「それじゃあ、一緒に行こっか、団長ちゃん！」」
    [p]
     [er]
    [jump target="*true_ending"]

*pseudo_select_siete
    [s]

*pseudo_select_hard
    [jump target="*auguste_arrival"]

*true_ending 
    [playbgm storage="bgm_action" loop="true"]
    [chara_show name="kaki" storage="kaki" pos="left"]
    [chara_show name="nni" storage="nni" pos="right"]
    [chara_show name="katuo" storage="katuo" pos="center"]
    #
    目の前には海のトンチキ生物達が現れた。[br]今度は負けない...！
    [p]
    カキフライ、ンニ、カツウォヌス、前から後ろから、左右から、海の生物が襲いかかる。
    [p]
    どれから対処すべきか...
    [l]

    ; 選択肢
    [link target="*hard_root" text="ンニ"] 
    [link target="*hard_root" text="カツウォヌス"] 
    [link target="*hard_root" text="カキフライ"] 
    [r]
    [s]
    *hard_root
    #カキフライ
    [shake name="kaki"]
    ！？
    [slash count="1" time="200" wait="false"]
    [chara_vanish name="kaki" time="400"]
[chara_show name="siete" storage="siete_normal" pos="left"]
#シエテ
後ろは任せて！
[p]
  [shake name="nni"]
  #ンニ
  ！！！？？
  [slash count="1" time="200" wait="false"]
  [chara_vanish name="nni" time="400"]
  [chara_hide name="katuo" time="200" wait="false"]
  [chara_show name="narumia" pos="right" time="500" wait="true"]
    #ナルメア
    うん！団長ちゃんは正面に集中して！
    [p]
 [chara_hide name="narumia" time="200" wait="true"]
    #
    [chara_show name="same" storage="same" pos="center" time="500" wait="true"]
    [chara_zoom name="same" scale="1.3" restore="true" restore_time="100"]
    サメ「━━━！」
    [p]
    [slash count="2" time="200" wait="false"]
    [chara_vanish name="same" time="500"]
     [chara_show name="koa" storage="koa" pos="center" time="500" wait="true"]
    [chara_zoom name="koa" scale="1.3" restore="true" restore_time="100"]
    アルバコア「━━━━！！！」[p]
    [slash count="2" time="200" wait="false"]
    [chara_vanish name="koa" time="500"]
    増援。君は選択を迫られる...
 [link target="*final_battle_trueend" text="ンナギ"]
    [link target="*final_battle_trueend" text="ンニ"]
    [link target="*final_battle_trueend" text="アルバコア"]
    [link target="*final_battle_trueend" text="煉獄カツウォヌス"] 
    [r]
    [s]

*final_battle_trueend
    [chara_show name="zombie" storage="zombie" pos="center"]
    [focus time="400"]
    #ゾンビィ
    「おっはよーございまーすっ！」
    [p]

    クァニ、灼弩火罹、ゾンビィ、更に増えるトンチキ生物達。
    [p]
    [vibrate time="300"]
     [chara_hide name="zombie" storage="zombie" pos="center"]
    無理だ。1人では━
    [p]

    ━でも、今は！
    [focus color="ffffff" time="600"]
  ; --- カットイン演出 (手動展開) ---
    [chara_show name="roger" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="roger" time="50"]
    [chara_show name="narumia" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="narumia" time="50"]
    [chara_show name="siete" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="siete" time="50"]
    [chara_show name="sandalphon" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="sandalphon" time="50"]
    [chara_show name="diantha" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="diantha" time="50"]
    [chara_show name="anthuria" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="anthuria" time="50"]
    [chara_show name="nier" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="nier" time="50"]
    [chara_show name="oigen" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="oigen" time="50"]
    [chara_show name="wilnas" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="wilnas" time="50"]
    [chara_show name="luoh" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="luoh" time="50"]
    [chara_show name="wamdus" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="wamdus" time="50"]
    [chara_show name="galleon" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="galleon" time="50"]
    [chara_show name="lowain" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="lowain" time="50"]
    [chara_show name="thug" pos="center" time="50"]
    [wait time="50"]
    [chara_hide name="thug" time="50"]
    [chara_show name="ruria" pos="center" time="100"]
    [wait time="500"]

    [playse storage="smash" stop="false"]
    [slash count="5" time="150" wait="false"]
    「1人じゃない！」
    [p]
    [vibrate time="400"]
    [chara_hide name="ruria" time="200" wait="true"]

    ; 仲間たちの加勢
    [chara_show name="oigen" pos="center" time="300"]
    [focus time="350"]
    #三羽烏
    「「「ソイヤッ！」」」
    [p]
    [chara_hide name="oigen" time="200" wait="true"]
      #
   カツウォヌスが捌かれる━
   [p]

    [chara_show name="wilnas" pos="center" time="300"]
    #ウィルナス
    「殲滅、殲滅！」
    [p]
    [slash count="3" time="200" wait="false"]
    [chara_hide name="wilnas" time="200" wait="true"]

    [chara_show name="wamdus" pos="center" time="300"]
    #ワムデュス
    「ワム、お腹すいた...全部食べる。」
    [p]
    [chara_hide name="wamdus" time="200" wait="true"]
ンニが、ンナギが、ゾンビが、
[p]
    [chara_show name="sandalphon" pos="center" time="300"]
    [chara_zoom name="sandalphon" scale="1.3" restore="true" restore_time="100"]
    #サンダルフォン
    「アイン•ソフ•オウル！」
    [p]
    [vibrate time="400"]
    [chara_hide name="sandalphon" time="200" wait="true"]
    #
    殆どの海の生物達が彼らの前に倒れた。
    [p]
    残すは━
    [p]

    #
    [chara_show name="chocokoa" storage="chocokoa" pos="center"]
    [focus color="ff9900" time="400"]
    [chara_zoom name="chocokoa" scale="1.5" restore="true" restore_time="200"]
    チョコ•アルバコア「チョコオオオオオオオオオオオオ━━━！！」
    [p]
    [vibrate time="300"]
    [chara_hide name="chocokoa" time="300" wait="true"]

    [chara_show name="ruria" pos="center" time="500"]
    #ルリア
    ...！目の中にもう一つ星晶獣の気配を感じます！
    [p]
    [chara_hide name="ruria" time="200" wait="true"]

    最後の選択だ、君は...
    [p]

    [link target="*shin_ending" text="目を狙う"]
    [link target="*failed_battle_badend" text="ヒレを狙う"]
    [r]
    [s]
*shin_ending
    [playbgm storage="ending_bgm" loop="true"]
    [chara_show name="ruria" storage="ruria_normal" pos="center" time="1000" wait="true"]
    #ルリア
    チョコを司る星晶獣なんて、びっくりです〜！あむっ！
    [p]
    #
    チョコ味になったアルバコアの甘さに頬を緩めながら、[br]ルリアは言う。[br]アウギュステ全体に漂うバレンタインムードは、[br]チョコの星晶獣「チョコアニィサキウス」の仕業だった。
    [p]
    その甘い香りを嗅いだものは、[br]無性に甘い気分になるのだ
    。[p]

    #ルリア
    そうそう！ずっとあなたを探してたんです！[br]これ、どうぞ！
    [p]
#
    ルリアの手から、丁寧に包装された包みが渡された。
    [p]

    #ルリア
    ハッピーバレンタイン♪[br]これからもよろしくお願いしますね！
    [p]
    [chara_hide name="ruria" time="300" wait="true"]
#
    ～HAPPY END～
    [p]
    ; ロジャーとコルワのセリフ
     [chara_show name="roger" storage="roger_normal" pos="left" ]


    #ロジャー
    うんうん、やっぱり最後は！
    [p]

     [chara_show name="korwa" storage="korwa_normal" pos="right"]
     #コルワ
    ハッピーエンドよね！
    [p]
    
    #
   

    ゲームブック[br]【演算世界とチヨコレイト】[br]〜完〜
    [p]
    [chara_hide name="roger" time="300" wait="true"]
    [chara_hide name="korwa" time="300" wait="true"]
    [clearscreen time="1500"]
    [jump storage="TitleScene"]
    [s]
